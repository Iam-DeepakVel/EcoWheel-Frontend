export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="200px"
        height="200px"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <circle
          cx={50}
          cy={50}
          r={32}
          strokeWidth={8}
          stroke="#93dbe9"
          strokeDasharray="50.26548245743669 50.26548245743669"
          fill="none"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="1s"
            repeatCount="indefinite"
            keyTimes="0;1"
            values="0 50 50;360 50 50"
          ></animateTransform>
        </circle>
        <circle
          cx={50}
          cy={50}
          r={23}
          strokeWidth={8}
          stroke="#689cc5"
          strokeDasharray="36.12831551628262 36.12831551628262"
          strokeDashoffset={36.12831551628262}
          fill="none"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="1s"
            repeatCount="indefinite"
            keyTimes="0;1"
            values="0 50 50;-360 50 50"
          ></animateTransform>
        </circle>
      </svg>
    </div>
  );
}
