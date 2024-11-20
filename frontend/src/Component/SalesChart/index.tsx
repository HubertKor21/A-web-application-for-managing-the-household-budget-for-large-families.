import ChartComponent from "../Chart";

const SalesChart = () => {
	return (
		<div className="md:w-[95%] w-[80%] bg-white shadow-sm rounded-xl mt-10 py-4">
			<div className="flex w-full items-center justify-between px-5">
				<span className="font-bold text-[#202224] text-[24px]">Sales Chart</span>
			</div>
			<ChartComponent />
		</div>
	);
};

export default SalesChart;
