import Foundation
import ImageIO
import UniformTypeIdentifiers
import CoreImage
// uso: webexport <origem> <destino> <maxPx> [trim] [pb]
// redimensiona, converte para sRGB e grava JPEG só com o copyright (sem GPS nem outros metadados)
// trim = recorta molduras pretas · pb / pbx / pbr = preto e branco (ver abaixo)
// maxPx = 0: não mexe na imagem; só regrava o arquivo com o copyright e sem GPS (sem recomprimir)
let a = CommandLine.arguments
let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: a[1]) as CFURL, nil)!

// direitos autorais gravados dentro do arquivo (EXIF/TIFF e IPTC)
let AUTOR = "Paulo Behar"
let AVISO = "© Paulo Behar. Todos os direitos reservados. Reprodução proibida sem autorização. paulobehar.com.br"
let copyright: [CFString: Any] = [
    kCGImagePropertyTIFFDictionary: [kCGImagePropertyTIFFArtist: AUTOR, kCGImagePropertyTIFFCopyright: AVISO],
    kCGImagePropertyIPTCDictionary: [kCGImagePropertyIPTCByline: [AUTOR], kCGImagePropertyIPTCCopyrightNotice: AVISO,
                                     kCGImagePropertyIPTCRightsUsageTerms: "Uso somente com autorização do autor."]
]

if a[3] == "0" {
    let meta = CGImageMetadataCreateMutable()
    CGImageMetadataSetValueMatchingImageProperty(meta, kCGImagePropertyTIFFDictionary, kCGImagePropertyTIFFArtist, AUTOR as CFString)
    CGImageMetadataSetValueMatchingImageProperty(meta, kCGImagePropertyTIFFDictionary, kCGImagePropertyTIFFCopyright, AVISO as CFString)
    CGImageMetadataSetValueMatchingImageProperty(meta, kCGImagePropertyIPTCDictionary, kCGImagePropertyIPTCCopyrightNotice, AVISO as CFString)
    let tmp = a[2] + ".tmp.jpg"
    let dst = CGImageDestinationCreateWithURL(URL(fileURLWithPath: tmp) as CFURL, UTType.jpeg.identifier as CFString, 1, nil)!
    let o: [CFString: Any] = [kCGImageDestinationMetadata: meta, kCGImageDestinationMergeMetadata: true,
                              kCGImageMetadataShouldExcludeGPS: true]
    guard CGImageDestinationCopyImageSource(dst, src, o as CFDictionary, nil) else { print("falhou"); exit(1) }
    try? FileManager.default.removeItem(atPath: a[2])
    try! FileManager.default.moveItem(atPath: tmp, toPath: a[2])
    print("copyright gravado")
    exit(0)
}
let opts: [CFString: Any] = [kCGImageSourceCreateThumbnailFromImageAlways: true,
                             kCGImageSourceCreateThumbnailWithTransform: true,
                             kCGImageSourceThumbnailMaxPixelSize: Int(a[3])!]
let img = CGImageSourceCreateThumbnailAtIndex(src, 0, opts as CFDictionary)!
let srgb = CGColorSpace(name: CGColorSpace.sRGB)!
let ctx = CGContext(data: nil, width: img.width, height: img.height, bitsPerComponent: 8, bytesPerRow: 0, space: srgb, bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue)!
ctx.draw(img, in: CGRect(x: 0, y: 0, width: img.width, height: img.height))
var out = ctx.makeImage()!
// opcional: recorta bordas pretas uniformes (faixas de "passe-partout")
let flags = Set(a.dropFirst(4))
if flags.contains("trim") {
    let w = out.width, h = out.height
    let data = ctx.data!.assumingMemoryBound(to: UInt8.self)
    let bpr = ctx.bytesPerRow
    func lum(_ x: Int, _ y: Int) -> Int { let o = y * bpr + x * 4; return (Int(data[o]) * 3 + Int(data[o+1]) * 6 + Int(data[o+2])) / 10 }
    func rowDark(_ y: Int) -> Bool { var d = 0; for x in stride(from: 0, to: w, by: 2) where lum(x, y) < 14 { d += 1 }; return d * 2 >= w * 98 / 100 }
    func colDark(_ x: Int) -> Bool { var d = 0; for y in stride(from: 0, to: h, by: 2) where lum(x, y) < 14 { d += 1 }; return d * 2 >= h * 98 / 100 }
    var top = 0; while top < h / 3 && rowDark(top) { top += 1 }
    var bot = h - 1; while bot > h * 2 / 3 && rowDark(bot) { bot -= 1 }
    var lef = 0; while lef < w / 3 && colDark(lef) { lef += 1 }
    var rig = w - 1; while rig > w * 2 / 3 && colDark(rig) { rig -= 1 }
    // margem de segurança de 2px para tirar a borda fina de transição
    let pad = 2
    let rect = CGRect(x: lef + pad, y: top + pad, width: rig - lef - 2 * pad, height: bot - top - 2 * pad)
    if rect.width < CGFloat(w) - 8 || rect.height < CGFloat(h) - 8 { out = out.cropping(to: rect)! }
}
// preto e branco "de fotógrafo"
//   pb  = filtro amarelo leve + curva em S suave (versão original, usada pelas fotos antigas)
//   pbx = filtro amarelo + curva suave, médios um pouco mais escuros + claridade leve — animais
//   pbr = filtro laranja leve (céu um pouco mais escuro) + mesma curva suave — paisagem, arquitetura
//   (13/11/2026: suavizado a pedido do Paulo; a versão forte ficava estourada e clara demais)
if let modo = ["pb", "pbx", "pbr"].first(where: { flags.contains($0) }) {
    var ci = CIImage(cgImage: out)
    let mix = CIFilter(name: "CIColorMatrix")!
    mix.setValue(ci, forKey: kCIInputImageKey)
    let w = modo == "pbr" ? CIVector(x: 0.45, y: 0.45, z: 0.10, w: 0)
                          : CIVector(x: 0.36, y: 0.50, z: 0.14, w: 0)
    mix.setValue(w, forKey: "inputRVector")
    mix.setValue(w, forKey: "inputGVector")
    mix.setValue(w, forKey: "inputBVector")
    ci = mix.outputImage!
    if modo != "pb" {
        // claridade: máscara de nitidez com raio grande = contraste local, dá "corpo" à foto
        let clar = CIFilter(name: "CIUnsharpMask")!
        clar.setValue(ci, forKey: kCIInputImageKey)
        clar.setValue(Double(max(out.width, out.height)) * 0.012, forKey: kCIInputRadiusKey)
        clar.setValue(0.15, forKey: kCIInputIntensityKey)
        ci = clar.outputImage!.cropped(to: ci.extent)
    }
    let forte = modo != "pb"
    let curve = CIFilter(name: "CIToneCurve")!
    curve.setValue(ci, forKey: kCIInputImageKey)
    curve.setValue(CIVector(x: 0, y: 0), forKey: "inputPoint0")
    curve.setValue(CIVector(x: 0.25, y: forte ? 0.20 : 0.20), forKey: "inputPoint1")
    curve.setValue(CIVector(x: 0.5, y: forte ? 0.46 : 0.5), forKey: "inputPoint2")
    curve.setValue(CIVector(x: 0.75, y: forte ? 0.76 : 0.80), forKey: "inputPoint3")
    curve.setValue(CIVector(x: 1, y: 1), forKey: "inputPoint4")
    ci = curve.outputImage!
    let cictx = CIContext(options: [.workingColorSpace: srgb, .outputColorSpace: srgb])
    out = cictx.createCGImage(ci, from: ci.extent, format: .RGBA8, colorSpace: srgb)!
}
let dst = CGImageDestinationCreateWithURL(URL(fileURLWithPath: a[2]) as CFURL, UTType.jpeg.identifier as CFString, 1, nil)!
var props = copyright
props[kCGImageDestinationLossyCompressionQuality] = 0.8
CGImageDestinationAddImage(dst, out, props as CFDictionary)
CGImageDestinationFinalize(dst)
print("\(out.width)x\(out.height)")
