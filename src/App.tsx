import { CSSProperties, MouseEventHandler, useState } from "react";
import "./App.css";

const App = () => {
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
	const initialState = (buttons.find(({ text }) => text === "C") as typeof buttons[number]).value as string;
	const [display, setDisplay] = useState(initialState);
	const [response, setResponse] = useState(false);

	const regex = { genericNumber: /^(\-)?\d+(\.\d+)?$/, numericDigit: /\d/ };

	const lastExpression: () => { lastNumber: string; lastDigit: string } = () => {
		const split = display.split(/[\+|\−|\×|\÷]/),
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
				setResponse(false);
				if (!regex.genericNumber.test(display)) return this.reset();
			}
			display.length === 1 ? this.reset() : setDisplay(display => display.slice(0, (buttons.find(({ text }) => text === "←") as typeof buttons[number]).value as number));
		},
		equal() {
			const { lastDigit } = lastExpression();
			if (!regex.numericDigit.test(lastDigit)) return;
			const trueSigns: (substring: string, ...args: any[]) => string = sign => (buttons.find(({ text }) => text === sign) as typeof buttons[number]).value as string;
			const falseSigns: (substring: string, ...args: any[]) => string = sign => (buttons.find(({ value }) => value === sign) as typeof buttons[number]).text;
			return setDisplay(display => String(eval(display.replace(/[\−|\×|\÷]/g, trueSigns))).replace(/[\-]/g, falseSigns)), setResponse(true);
		},
		symbols(buttonText: string) {
      if (response) {
        setResponse(false);
				if (!regex.genericNumber.test(display)) return this.reset();
			} else {
        const { lastNumber, lastDigit } = lastExpression();
        // if (["0", ""].some(value => value === lastNumber)) {
				// 	if (buttonText === "−") return setDisplay(display => display.slice(0, -1).concat(buttonText));
				// }
        if (buttonText === ".") {
					if (!lastNumber) return setDisplay(display => display.concat("0", buttonText));
					if (lastNumber.includes(buttonText)) return;
				}
				if (!regex.numericDigit.test(lastDigit)) return;
			}
			setDisplay(display => display.concat(buttonText));
		},
		numbers(buttonText: string) {
      if (response) return setResponse(false), setDisplay(buttonText);
			const { lastNumber, lastDigit } = lastExpression();
			if (lastNumber === "0") {
				if (buttonText === "0") return;
				if (regex.numericDigit.test(buttonText)) return setDisplay(display => display.slice(0, -1).concat(buttonText));
			}
			setDisplay(display => display.concat(buttonText));
		},
	};

	// const reset: VoidFunction = () => {
	// 	display !== initialState && setDisplay(initialState);
	// };
	// const backspace: VoidFunction = () => {
	// 	display.length === 1 ? reset() : setDisplay(display => display.slice(0, (buttons.find(({ text }) => text === "←") as typeof buttons[number]).value as number));
	// };
	// const equal: VoidFunction = () => {
	// 	const { lastDigit } = lastExpression();
	// 	if (!regex.numericDigit.test(lastDigit)) return;
	// 	const trueSigns: (substring: string, ...args: any[]) => string = sign => (buttons.find(({ text }) => text === sign) as typeof buttons[number]).value as string;
	// 	const falseSigns: (substring: string, ...args: any[]) => string = sign => (buttons.find(({ value }) => value === sign) as typeof buttons[number]).text;
	// 	return setDisplay(display => String(eval(display.replace(/[\−|\×|\÷]/g, trueSigns))).replace(/[\-]/g, falseSigns)), setResponse(true);
	// };
	// const symbols: (buttonText: string) => void = buttonText => {
	// 	const { lastNumber, lastDigit } = lastExpression();
	// 	if (response) {
	// 		setResponse(false);
	// 		if (!regex.genericNumber.test(display)) return reset();
	// 	} else {
	// 		if (["0", ""].some(value => value === lastNumber)) {
	// 			if (buttonText === "−") return setDisplay(display => display.slice(0, -1).concat(buttonText));
	// 		}
	// 		if (!regex.numericDigit.test(lastDigit)) return;
	// 	}
	// 	setDisplay(display => display.concat(buttonText));
	// };
	// const numbers: (buttonText: string) => void = buttonText => {
	// 	const { lastNumber, lastDigit } = lastExpression();
	// 	if (response) return setResponse(false), setDisplay(buttonText);
	// 	if (lastNumber === "0") {
	// 		if (buttonText === "0") return;
	// 		if (regex.numericDigit.test(buttonText)) return setDisplay(display => display.slice(0, -1).concat(buttonText));
	// 	}
	// 	setDisplay(display => display.concat(buttonText));
	// };

	const handler: (buttonText: string) => MouseEventHandler<HTMLButtonElement> = buttonText => _ => {
		if (buttonText === "←") return actions.backspace();
		if (buttonText === "C") return actions.reset();
		if (buttonText === "=") return actions.equal();
		if (/\d/.test(buttonText)) return actions.numbers(buttonText);
		return actions.symbols(buttonText);

		// // If the last parameter of the operation is a sign and the chosen button is also, it will not do any action.
		// if ([lastDigit, buttonText].every(string => /[\+|\−|\×|\÷]/.test(string))) return;

		// if (buttonText === ".") {
		// 	if (!lastNumber) return setDisplay(display => display.concat("0", buttonText));
		// 	if (lastNumber.includes(buttonText)) return;
		// }
		// if (lastNumber === "0") {
		// 	if (buttonText === "0") return;
		// 	if (!/[\+|\−|\×|\÷\.]/.test(buttonText)) return setDisplay(display => display.slice(0, -1).concat(buttonText));
		// }
		// if (lastDigit === "." && /[\+|\−|\×|\÷]/.test(buttonText)) return;
		// setDisplay(display => display.concat(buttonText));
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
