import loading from "../assets/spinner/bottle-filling.gif";

function Spinner() {
  return (
    <div className="absolute z-40 h-screen w-screen backdrop-blur-2xl flex flex-col justify-center items-center">
      <img className="h-40" src={loading} alt="spinning" />
      <p className="text-neutral font-semibold">Loading...</p>
    </div>
  );
}

export default Spinner;