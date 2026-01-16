import { MediaItem } from '../../../types'

interface Props {
  item: MediaItem
  isHovered: boolean
}

export const CardMedia = ({ item, isHovered }: Props) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-900">
      {item.type === 'video' ? (
        <>
          {!isHovered ? (
            <img
              src={item.previewUrl}
              className="w-full h-full object-cover"
              alt=""
              loading="lazy"
            />
          ) : (
            <video
              src={item.fileUrl}
              className="w-full h-full object-cover"
              muted
              loop
              autoPlay
              playsInline
            />
          )}
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md z-20 border border-white/5">
            <span className="text-[8px] font-black text-white tracking-widest uppercase">
              Video
            </span>
          </div>
        </>
      ) : (
        <img
          src={item.previewUrl}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
          alt=""
          loading="lazy"
        />
      )}
    </div>
  )
}
