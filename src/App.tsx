import { CSSProperties, MouseEventHandler, useState } from "react";
import "./App.css";

const App = () => {
	const [display, setDisplay] = useState("0");
	const buttons: { text: string; value: number | string; styles?: CSSProperties }[] = [
		{ text: "C", value: "0", styles: { gridColumn: "span 2" } },
		{ text: "←", value: -1 },
		{ text: "÷", value: "/" },
		{ text: "7", value: 7 },
		{ text: "8", value: 8 },
		{ text: "9", value: 9 },
		{ text: "×", value: "*" },
		{ text: "4", value: 4 },
		{ text: "5", value: 5 },
		{ text: "6", value: 6 },
		{ text: "−", value: "-" },
		{ text: "1", value: 1 },
		{ text: "2", value: 2 },
		{ text: "3", value: 3 },
		{ text: "+", value: "+" },
		{ text: "0", value: 0 },
		{ text: ".", value: "." },
		{ text: "=", value: "=", styles: { gridColumn: "span 2" } },
	];
	const handler: (buttonText: string) => MouseEventHandler<HTMLButtonElement> = buttonText => _ => {
		const split = display.split(/[\+|\−|\×|\÷]/);
		if ([display.slice(-1), buttonText].every(string => /[\+|\−|\×|\÷]/.test(string))) return;
		if (buttonText === "←") return setDisplay(display => display.slice(0, (buttons.find(({ text }) => text === buttonText) as typeof buttons[number]).value as number));
		if (buttonText === "C") return setDisplay((buttons.find(({ text }) => text === buttonText) as typeof buttons[number]).value as string);
		if (buttonText === "=") {
			if (split[split.length - 1].slice(-1) === ".") return;
			if (!/[\+|\−|\×|\÷]/.test(display.slice(-1))) return setDisplay(display => String(eval(display.replace(/[\−|\×|\÷]/g, sign => (buttons.find(({ text }) => text === sign) as typeof buttons[number]).value as string))));
      return;
		}
		if (buttonText === ".") {
			if (!split[split.length - 1]) return setDisplay(display => display.concat("0", buttonText));
			if (split[split.length - 1].includes(buttonText)) return;
		}
		if (split[split.length - 1] === "0") {
			if (buttonText === "0") return;
			if (buttonText !== ".") return setDisplay(display => display.slice(0, -1).concat(buttonText));
		}
		if (split[split.length - 1].slice(-1) === "." && /[\+|\−|\×|\÷]/.test(buttonText)) return;
		setDisplay(display => display.concat(String(buttonText)));
	};
	return (
		<>
			<div className={"calculator"}>
				<div className={"display"}>
					<span>{display}</span>
				</div>
				<div className={"buttons"}>
					{buttons.map(({ text, styles }, index) => (
						<button key={index} onClick={handler(text)} style={styles}>
							{text}
						</button>
					))}
				</div>
			</div>
		</>
	);
};
export default App;
