import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: 'center',
        background: '#182033',
        color: '#aa7df5',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
      }}
    >
      <div
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: 118,
          fontWeight: 700,
          letterSpacing: '-0.08em',
          lineHeight: 1,
          paddingRight: 10,
        }}
      >
        E
      </div>

      <div
        style={{
          background: '#c7a76a',
          borderRadius: 999,
          height: 18,
          position: 'absolute',
          right: 28,
          top: 28,
          width: 18,
        }}
      />
    </div>,
    {
      ...size,
    },
  );
}
