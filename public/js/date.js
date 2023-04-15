const date = new Date();

const setYearSelectOptions = (yearSelect) => {
	let yearOpt = `<option value="">연도</option>`;
	let year = date.getFullYear();
	for (let i = year; i > year - 20; i--) {
		yearOpt += `<option value="${i}">${i}년</option>`;
	}
	yearSelect.innerHTML = yearOpt;
};

const setMonthSelectOptions = (yearSelect, monthSelect) => {
	const month = date.getMonth() + 1;
	const year = yearSelect[yearSelect.selectedIndex].value;
	let monthOpt = `<option value="">월</option>`;
	let m;
	if (year == "") m = 1;
	else if (year == date.getFullYear()) m = month;
	else m = 13;
	for (let i = 1; i < m; i++) {
		monthOpt += `<option value="${i < 10 ? "0" + i : i}">${i}월</option>`;
	}
	monthSelect.innerHTML = monthOpt;
};

export { setYearSelectOptions, setMonthSelectOptions };
