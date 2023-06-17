export default function SplashScreen({ gradient = true, dots = true }) {
  // Swap this logo with your own
  const logo = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="42"
      height="75"
      viewBox="0 0 42 75"
    >
      <path
        d="M12.987 75.612H4.739V48.384a10.86 10.86 0 01.245-3.377A13.026 13.026 0 018.95 38.2 20.974 20.974 0 010 21a21.006 21.006 0 0140.35-8.174 21.022 21.022 0 01-7.558 25.554 12.635 12.635 0 013.632 6.27 18.925 18.925 0 01.64 3.735V75.61h-8.151V48.384a7.507 7.507 0 00-1.019-2.98 6.715 6.715 0 00-2.074-2.175 8.238 8.238 0 00-3.829-1.252c-.333.016-.667.023-.991.023-.386 0-.769-.01-1.139-.031a8.158 8.158 0 00-3.85 1.235 6.51 6.51 0 00-2.055 2.179 7.381 7.381 0 00-.969 3v27.228zM21 8a11.476 11.476 0 00-8.485 3.808A13.48 13.48 0 009 21a13.481 13.481 0 003.515 9.193 11.358 11.358 0 0016.971 0A13.481 13.481 0 0033 21a13.479 13.479 0 00-3.515-9.192A11.477 11.477 0 0021 8z"
        fill="#009a48"
      />
    </svg>
  );

  return (
    <div id="splash-screen">
      <div className="splash-content">
        <div className="splash-content-border">
          <div className="splash-content-core" />
        </div>
        <div className="splash-logo">{logo}</div>
      </div>
      {gradient && <div className="splash-gradient" />}
      {dots && <div className="dots" />}
    </div>
  );
}
