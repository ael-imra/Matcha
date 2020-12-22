import React, { useContext } from "react";
import { DataContext } from "../Context/AppContext";
import "../Css/menu.css";
import { language } from "../Data/language/language";
import back from "../Images/back.png";
import next from "../Images/next.png";
import { Toggle } from "./Switch";

const Menu = () => {
	const ctx = useContext(DataContext);
	return (
		<div className='container-tab'>
			<div
				className='tab'
				style={{
					backgroundColor: ctx.Mode === "Dark" ? "#313131" : "white",
				}}
			>
				<p
					style={{
						color: ctx.Mode === "Dark" ? "white" : "black",
					}}
				>
					{language[ctx.Lang].setting}
				</p>
				<div className='mode'>
					<p
						style={{
							color: ctx.Mode === "Dark" ? "white" : "black",
						}}
					>
						{language[ctx.Lang].mode} {ctx.Mode}{" "}
					</p>
					<Toggle
						list={["Light", "Dark"]}
						active={ctx.Mode}
						switch={() => {
							ctx.changeMode((oldValue) => (oldValue === "Light" ? "Dark" : "Light"));
						}}
						colors={["#03a9f1", "#292f3f"]}
					/>
				</div>
				<div className='language'>
					<p
						style={{
							color: ctx.Mode === "Dark" ? "white" : "black",
						}}
					>
						{language[ctx.Lang].language}{" "}
					</p>
					<div className='switch-language'>
						<img
							src={back}
							alt='back'
							onClick={() => {
								if (ctx.Lang > 0) ctx.changeLang(ctx.Lang - 1);
							}}
							style={{ opacity: ctx.Lang > 0 ? 1 : 0 }}
						/>
						<p>{language[ctx.Lang].lang}</p>
						<img
							src={next}
							alt='next'
							onClick={() => {
								if (ctx.Lang < 1) ctx.changeLang(ctx.Lang + 1);
							}}
							style={{ opacity: ctx.Lang < 1 ? 1 : 0 }}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Menu;
