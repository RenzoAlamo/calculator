import { CSSProperties, MouseEventHandler, useState } from "react";
import "./App.css";

const App = () => {
	const buttons: { text: string; value: number | string | [string, string]; styles?: CSSProperties }[] = [
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
		{ text: "+/−", value: ["+", "−"] },
		{ text: "0", value: 0 },
		{ text: ".", value: "." },
		{ text: "=", value: "=" },
	];
	const initialState = (buttons.find(({ text }) => text === "C") as typeof buttons[number]).value as string;
	const [display, setDisplay] = useState(initialState);
	const [response, setResponse] = useState(false);

	const regex = {
		genericNumber: /^(\−)?\d+(\.\d+)?$/,
		numericDigit: /\d/,
		signs: /[\+|\−|\×|\÷]/,
		falseSigns: /[\−|\×|\÷]/g,
	};

	const lastExpression: () => { lastNumber: string; lastDigit: string } = () => {
		const split = display.split(regex.signs),
			lastNumber = split[split.length - 1],
			lastDigit = lastNumber.slice(-1);
		return { lastNumber, lastDigit };
	};

	const actions = {
		reset() {
			display !== initialState && setDisplay(initialState);
		},
		backspace() {
			if (response) {
				setResponse(!response);
				if (!regex.genericNumber.test(display)) return this.reset();
			}
			if (display.length === 1) return this.reset();
			const end = (buttons.find(({ text }) => text === "←") as typeof buttons[number]).value as number,
				split = display
					.split(/[\+|\−|\×|\÷]/)
					.map((value, index, array) => (index ? (value ? (array[index - 1] ? value : "−".concat(value)) : index === array.length - 1 ? "−" : value) : value))
					.filter(value => value),
				lastNumber = split[split.length - 1];
			return setDisplay(display.slice(0, lastNumber.length === 2 && lastNumber.includes("−") ? end * 2 : end));
		},
		equal() {
			const split = display.split(regex.signs),
				lastNumber = split[split.length - 1],
				lastNumber_lastDigit = lastNumber.slice(-1);
			if (!regex.numericDigit.test(lastNumber_lastDigit)) return;
			const trueSigns: (substring: string, ...args: any[]) => string = sign => (buttons.find(({ text }) => text === sign) as typeof buttons[number]).value as string;
			const falseSigns: (substring: string, ...args: any[]) => string = sign => (buttons.find(({ value }) => value === sign) as typeof buttons[number]).text;
			return setDisplay(String(eval(display.replace(regex.falseSigns, trueSigns))).replace(/[\-]/g, falseSigns)), setResponse(!response);
		},
		symbols(buttonText: string, callback?: () => boolean) {
			if (response) {
				setResponse(!response);
				if (buttonText === "." && display.includes(buttonText)) return setDisplay("0".concat(buttonText));
				if (!regex.genericNumber.test(display)) return this.reset();
				return setDisplay(display.concat(buttonText));
			}
			if (!callback || callback()) {
				const lastDigit = display.slice(-1);
				if ([regex.signs, /\./].some(regex => regex.test(lastDigit))) return;
				setDisplay(display.concat(buttonText));
			}
		},
		changeSign() {
			if (response) {
				setResponse(!response);
				if (!regex.genericNumber.test(display)) return this.reset();
			}
			let displaySplit = display.split(regex.signs),
				lastNumber = displaySplit[displaySplit.length - 1];
			if (lastNumber) {
				displaySplit = displaySplit.map((value, index, array) => (index ? (value ? (array[index - 1] ? value : "−".concat(value)) : index === array.length - 1 ? "−" : value) : value)).filter(value => value);
				lastNumber = displaySplit[displaySplit.length - 1];
				const index = display.lastIndexOf(lastNumber);
				const minus = lastNumber.includes("−");
				const split = [...display];
				console.log({ lastNumber, minus });
				split.splice(index, minus ? 1 : 0, minus ? "" : "−");
				setDisplay(split.join(""));
			}
		},
		point() {
			const point = ".";
			this.symbols(point, () => {
				const split = display.split(regex.signs),
					lastNumber = split[split.length - 1];
				if (!lastNumber) return setDisplay(display.concat("0", point)), false;
				if (lastNumber.includes(point)) return false;
				return true;
			});
		},
		numbers(buttonText: string) {
			if (response) return setResponse(!response), setDisplay(buttonText);
			const { lastNumber, lastDigit } = lastExpression();
			if (lastNumber === "0") {
				if (buttonText === "0") return;
				if (regex.numericDigit.test(buttonText)) return setDisplay(display.slice(0, -1).concat(buttonText));
			}
			setDisplay(display.concat(buttonText));
		},
	};

	const handler: (buttonText: string) => MouseEventHandler<HTMLButtonElement> = buttonText => _ => {
		if (buttonText === "←") return actions.backspace();
		if (buttonText === "C") return actions.reset();
		if (buttonText === "=") return actions.equal();
		if (buttonText === ".") return actions.point();
		if (buttonText === "+/−") return actions.changeSign();
		if (/\d/.test(buttonText)) return actions.numbers(buttonText);
		return actions.symbols(buttonText);
	};
	return (
		<>
			<div className={"calculator"}>
				<div className={"display"}>
					{/* <input
						type="text"
						onKeyPress={event => {
							console.log((event.target as any).selectionStart);
						}}
            value={display}
					/> */}
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
