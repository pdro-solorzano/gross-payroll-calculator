interface Props {
  text: string;
}

function Button({ text }: Props) {
  return (
    <button
      className="w-full bg-blue-500 py-3 rounded-xl text-white font-body text-xl font-medium 
    hover:bg-blue-400 active:bg-blue-600 focus:outline-2 focus:outline-blue-800 cursor-pointer lg:rounded-2xl"
    >
      {text}
    </button>
  );
}

export { Button };
