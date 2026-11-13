// Comprime um vídeo para a web: H.264 com taxa controlada + áudio AAC, "fast start".
// Uso: swiftc -O videoweb.swift -o .videoweb && ./.videoweb entrada.mp4 saida.mp4 [kbps-video] [corte: x,y,largura,altura]
// O corte remove faixas pretas embutidas no arquivo (ex.: 201,0,1518,1080).
import AVFoundation

let args = CommandLine.arguments
let input = URL(fileURLWithPath: args[1])
let output = URL(fileURLWithPath: args[2])
let videoKbps = args.count > 3 ? Int(args[3])! : 3000
try? FileManager.default.removeItem(at: output)

let asset = AVURLAsset(url: input)
let reader = try! AVAssetReader(asset: asset)
let writer = try! AVAssetWriter(outputURL: output, fileType: .mp4)
writer.shouldOptimizeForNetworkUse = true   // fast start: começa a tocar enquanto baixa

let vTrack = asset.tracks(withMediaType: .video).first!
let size = vTrack.naturalSize.applying(vTrack.preferredTransform)
var w = Int(abs(size.width)), h = Int(abs(size.height))

let pixelSettings: [String: Any] = [
    kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange]
let vOut: AVAssetReaderOutput
if args.count > 4 {
    // recorte: desloca a imagem e define o novo tamanho do quadro
    let c = args[4].split(separator: ",").map { Int($0)! }
    w = c[2]; h = c[3]
    let comp = AVMutableVideoComposition()
    comp.renderSize = CGSize(width: w, height: h)
    comp.frameDuration = vTrack.minFrameDuration.isValid && vTrack.minFrameDuration.seconds > 0
        ? vTrack.minFrameDuration : CMTime(value: 1, timescale: 30)
    let instr = AVMutableVideoCompositionInstruction()
    instr.timeRange = CMTimeRange(start: .zero, duration: asset.duration)
    let layer = AVMutableVideoCompositionLayerInstruction(assetTrack: vTrack)
    layer.setTransform(vTrack.preferredTransform.concatenating(
        CGAffineTransform(translationX: CGFloat(-c[0]), y: CGFloat(-c[1]))), at: .zero)
    instr.layerInstructions = [layer]
    comp.instructions = [instr]
    let o = AVAssetReaderVideoCompositionOutput(videoTracks: [vTrack], videoSettings: pixelSettings)
    o.videoComposition = comp
    vOut = o
} else {
    vOut = AVAssetReaderTrackOutput(track: vTrack, outputSettings: pixelSettings)
}
reader.add(vOut)
let vIn = AVAssetWriterInput(mediaType: .video, outputSettings: [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: w, AVVideoHeightKey: h,
    AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: videoKbps * 1000,
        AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
        AVVideoMaxKeyFrameIntervalKey: 60]])
if args.count <= 4 { vIn.transform = vTrack.preferredTransform }
vIn.expectsMediaDataInRealTime = false
writer.add(vIn)

var aOut: AVAssetReaderTrackOutput?
var aIn: AVAssetWriterInput?
if let aTrack = asset.tracks(withMediaType: .audio).first {
    let o = AVAssetReaderTrackOutput(track: aTrack, outputSettings: [AVFormatIDKey: kAudioFormatLinearPCM])
    reader.add(o); aOut = o
    let i = AVAssetWriterInput(mediaType: .audio, outputSettings: [
        AVFormatIDKey: kAudioFormatMPEG4AAC, AVNumberOfChannelsKey: 2,
        AVSampleRateKey: 44100, AVEncoderBitRateKey: 160_000])
    i.expectsMediaDataInRealTime = false
    writer.add(i); aIn = i
}

reader.startReading()
writer.startWriting()
writer.startSession(atSourceTime: .zero)

let group = DispatchGroup()
func pump(_ input: AVAssetWriterInput, _ out: AVAssetReaderOutput, _ label: String) {
    group.enter()
    input.requestMediaDataWhenReady(on: DispatchQueue(label: label)) {
        while input.isReadyForMoreMediaData {
            if let buf = out.copyNextSampleBuffer() { input.append(buf) }
            else { input.markAsFinished(); group.leave(); return }
        }
    }
}
pump(vIn, vOut, "video")
if let aIn = aIn, let aOut = aOut { pump(aIn, aOut, "audio") }
group.wait()
let done = DispatchSemaphore(value: 0)
writer.finishWriting { done.signal() }
done.wait()
if writer.status != .completed { print("ERRO:", writer.error ?? "?"); exit(1) }
print("ok \(w)x\(h) \(videoKbps)kbps áudio:\(aIn != nil)")
