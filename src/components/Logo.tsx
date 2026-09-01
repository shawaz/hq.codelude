/**
 * The Codelude mark.
 *
 * The source SVG is a 546 square with the mark occupying only the middle —
 * roughly x 118-428, y 164-381 — so at any given size most of the box was
 * empty and the mark read small. The viewBox is cropped to its bounds, centred
 * on (273, 273) to stay square, which makes it render substantially larger for
 * the same size prop.
 *
 * The source also hardcodes a white background rect and a black fill, which
 * would render as a white tile in the dark sidebar and never invert. The rect
 * is dropped here and the path set to currentColor, so the mark takes its
 * container's colour and flips with the theme.
 *
 * src/app/icon.svg keeps a white ground on purpose — a favicon sits on the
 * browser's chrome, not ours, and a transparent mark vanishes on a light tab bar.
 */
export default function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="108 108 330 330"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0, display: 'block' }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M317.255 164.286C378.391 164.286 427.951 212.799 427.951 272.643C427.951 332.487 378.391 381 317.255 381H228.745C167.609 381 118.049 332.487 118.049 272.643C118.049 212.799 167.609 164.286 228.745 164.286H317.255ZM314.418 199.75C272.495 199.751 238.51 232.408 238.51 272.693C238.51 312.977 272.496 345.634 314.418 345.634C356.342 345.634 390.327 312.977 390.328 272.693C390.328 232.408 356.342 199.75 314.418 199.75ZM231.824 198.048C191.728 198.049 159.224 230.553 159.224 270.648C159.224 310.743 191.728 343.247 231.824 343.248H241.421C215.032 331.084 198.233 303.157 198.233 270.648C198.233 238.139 215.032 210.212 241.421 198.048H231.824Z"
        fill="currentColor"
      />
    </svg>
  );
}
