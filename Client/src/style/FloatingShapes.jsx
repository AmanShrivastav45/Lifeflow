import { motion } from "framer-motion";

const FloatingShape = ({ size, top, left, delay }) => {
	return (
		<motion.div
			className={` absolute rounded-full bg-[#d32e2e] ${size} opacity-20 blur-xl`}
			style={{ top, left ,zIndex:0}}
			animate={{
				y: ["0%", "100%", "0%"],
				x: ["0%", "100%", "0%"],
				rotate: [0, 360],
			}}
			transition={{
				duration: 20,
				ease: "linear",
				repeat: Infinity,
				delay,
			}}
			aria-hidden='true'
		/>
	);
};
export default FloatingShape;
