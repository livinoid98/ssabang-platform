import { fetchJuso } from "./juso.js";
import { fetchAPTInfo } from "./apt.js";
import { setYearSelectOptions, setMonthSelectOptions } from "./date.js";

const sidoSelect = document.querySelector(".sido");
const gugunSelect = document.querySelector(".gugun");
const dongSelect = document.querySelector(".dong");
const yearSelect = document.querySelector(".year");
const monthSelect = document.querySelector(".month");
const mapLeft = document.querySelector(".map-left");
const container = document.querySelector(".main-right");
const pagination = document.querySelector(".map-left-pagination");

const position = new kakao.maps.LatLng(37.50130771347553, 127.03961598444006 );
const options = {
	center: position,
	level: 3,
};
const map = new kakao.maps.Map(container, options);

let pageNo, totalPageNo;
let positions = [];
let markers = [],
	marker;
let infowindow;
let prevSelectedIndex = -1;

// 페이지 목록 업데이트
const updatePagination = (startNum) => {
	for (let i = 0; i < 5; i++) {
		if (startNum + i > totalPageNo) break;
		pagination.children[i + 1].innerHTML = startNum + i;
	}
	pageNo = startNum;
};

// map-left의 목록의 세부정보 보여주는 함수
const showAptInfo = (index) => {
	if (index != prevSelectedIndex && prevSelectedIndex != -1) {
		document
			.querySelector(`.info${prevSelectedIndex} div`)
			.classList.add("none");
	}
	document.querySelector(`.info${index} div`).classList.toggle("none");
	prevSelectedIndex = index;
};

// 선택한 마커나 목록의 아파트의 인포윈도우를 지도에 생성하는 함수
const showInfoWindow = (marker, info) => {
	if (infowindow != null) {
		infowindow.close();
	}
	infowindow = new kakao.maps.InfoWindow({
		content: `<div style="width:150px;text-align:center;padding:6px 0;">${info}</div>`,
	});
	infowindow.open(map, marker);
};

// 마커의 클릭 이벤트 함수
const makeMarkerClickListener = (marker, apt, index, position) => {
	return () => {
		showAptInfo(index);
		showInfoWindow(marker, apt);
		map.setCenter(position);
	};
};

const updateMap = (address, apt, index) => {
	const geocoder = new kakao.maps.services.Geocoder();

	geocoder.addressSearch(address, (result, status) => {
		if (status === kakao.maps.services.Status.OK) {
			const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

			marker = new kakao.maps.Marker({
				map: map,
				title: apt,
				position: coords,
			});

			markers.push(marker);
			positions.push(coords);

			kakao.maps.event.addListener(
				marker,
				"click",
				makeMarkerClickListener(marker, apt, index, coords)
			);
			map.setCenter(coords);
		}
	});
};

// 시/도 선택시 구/군 업데이트
const updateGugun = async () => {
	let regcode = sidoSelect.value;
	let gugunInnerHTML = "<option>구/군</option>";

	//   console.log(regcode);
	if (!isNaN(regcode)) {
		regcode = regcode.substring(0, 2) + "*" + regcode.substring(3, 8);

		const gugun = await fetchJuso(regcode);

		//   console.log(gugun);
		for (let i = 1; i < gugun.length; i++) {
			let name = gugun[i].name.split(" ");
			name.splice(0, 1);
			gugunInnerHTML += `<option value=${gugun[i].code}>${name.join(
				" "
			)}</option>`;
		}
	}

	gugunSelect.innerHTML = gugunInnerHTML;
	dongSelect.innerHTML = "<option>동</option>";
};

// 구/군 선택시 동 업데이트
const updateDong = async () => {
	let regcode = gugunSelect.value;
	let dongInnerHTML = "<option>동</option>";

	//   console.log(regcode);
	if (!isNaN(regcode)) {
		regcode = regcode.substring(0, 4) + "*";

		const dong = await fetchJuso(regcode);

		//   console.log(dong);
		for (let i = 1; i < dong.length; i++) {
			let name = dong[i].name.split(" ");
			name.splice(0, 2);
			dongInnerHTML += `<option value=${dong[i].code}>${name.join(
				" "
			)}</option>`;
		}
	}

	dongSelect.innerHTML = dongInnerHTML;
};

// 동 선택시 해당 선택한 지역에 있는 아파트 정보 불러오기
const updateAPT = async () => {
	const regcode = gugunSelect.value.substr(0, 5);
	const date = `${yearSelect.value}${monthSelect.value}`;

	if (yearSelect.value == "" || monthSelect.value == "") {
		alert("년도를 선택해주세요.");
		return;
	}

	const { apts, totalCount } = await fetchAPTInfo(regcode, date, 1);
	totalPageNo = totalCount;
	pageNo = 1;

	markers.forEach((marker) => {
		marker.setMap(null);
	});
	markers = [];
	positions = [];

	mapLeft.replaceChildren();
	for (let i = 0; i < apts.length; i++) {
		const apt = apts[i];
		let aptInfoDiv = document.createElement("div");
		aptInfoDiv.classList.add("main-left-info");
		aptInfoDiv.classList.add(`info${i}`);

		let address =
			apt.querySelector("법정동").textContent +
			" " +
			apt.querySelector("지번").textContent;
		// console.log(address);

		let innerHTML = `
		<p class="info-apt">${apt.querySelector("아파트").textContent}</p>
		<div class="none">
			<p>${apt.querySelector("층").textContent}층</p>
			<p>${apt.querySelector("전용면적").textContent}평</p>
			<p>${apt.querySelector("법정동").textContent}</p>
			<p>${apt.querySelector("거래금액").textContent}만원</p>
		</div>
		`;

		aptInfoDiv.innerHTML = innerHTML;

		// 지도에 마커 생성
		updateMap(address, apt.querySelector("아파트").textContent, i);

		prevSelectedIndex = -1;

		// 왼쪽 목록에서 선택 시
		aptInfoDiv.addEventListener("click", (e) => {
			const index = e.currentTarget.classList[1].substr(-1, 1);
			// 이전에 선택된 정보 가려주고 선택한 마커 토글
			showAptInfo(index);
			showInfoWindow(
				markers[index],
				e.currentTarget.children[0].textContent
			);
			// 해당 마커 위치가 정중앙에 설정
			map.setCenter(positions[index]);
		});

		mapLeft.append(aptInfoDiv);
	}
};

sidoSelect.addEventListener("change", updateGugun);
gugunSelect.addEventListener("change", updateDong);
dongSelect.addEventListener("change", updateAPT);
yearSelect.addEventListener("change", () => {
	setMonthSelectOptions(yearSelect, monthSelect);
});

// 페이지 로딩시 광역시 정보 로딩 및 년도 정보 업데이트
window.onload = async () => {
	const sido = await fetchJuso("*00000000");
	let sidoInnerHTML = "<option>광역시</option>";

	//   console.log(sido);

	sido.forEach((item) => {
		sidoInnerHTML += `<option value=${item.code}>${item.name}</option>`;
	});

	sidoSelect.innerHTML = sidoInnerHTML;

	setYearSelectOptions(yearSelect);
};

