import styles from "./App.module.css";
import "./App.css";

// const App = () => {
// 	return (
// 		<div className={styles.calculator}>
// 			<div className={styles.display}>Content</div>
// 			<div className={styles.buttons}>
// 				<button>%</button>
// 				<button>^</button>
// 				<button>9</button>
// 				<button>x</button>
// 				<button
// 					style={{
// 						height: "50%",
// 					}}>
// 					7
// 				</button>
// 				<button>8</button>
// 				<button>9</button>
// 				<button>x</button>
// 				<button>4</button>
// 				<button>5</button>
// 				<button>6</button>
// 				<button>-</button>
// 				<button>1</button>
// 				<button>2</button>
// 				<button>3</button>
// 				<button>+</button>
// 				<button>_</button>
// 				<button>.</button>
// 				<button>_</button>
// 				<button>=</button>
// 			</div>
// 		</div>
// 	);
// };

const buttons: { name: string; value: number | string }[] = [
	{ name: "7", value: 7 },
	{ name: "8", value: 8 },
	{ name: "9", value: 9 },
	{ name: "×", value: "*" },
	{ name: "4", value: 4 },
	{ name: "5", value: 5 },
	{ name: "6", value: 6 },
	{ name: "-", value: "-" },
	{ name: "1", value: 1 },
	{ name: "2", value: 2 },
	{ name: "3", value: 3 },
	{ name: "+", value: "+" },
	{ name: " ", value: 1 },
	{ name: "0", value: 0 },
	{ name: ".", value: "." },
	{ name: "=", value: "=" },
];

const App = () => (
	<>
		<div className="calculator">
			<div className="display"></div>
			<div className="buttons">
				{buttons.map((button, index) => (
					<button key={index} disabled={index === 12}>
						{button.name}
					</button>
				))}
			</div>
			{/* <section className=""></section> */}
		</div>
	</>
);

export default App;
