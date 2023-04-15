import { dataGoKrKey } from "./keys.js";

export const fetchAPTInfo = async (regcode, date, pageNo) => {
	const aptUrl =
		"http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev";

	const targetAptUrl = `${aptUrl}?serviceKey=${dataGoKrKey}&LAWD_CD=${regcode}&DEAL_YMD=${date}&pageNo=${pageNo}&numOfRows=5`;
	const response = await fetch(targetAptUrl);
	const data = await response.text();

	let parser = new DOMParser();
	const xml = parser.parseFromString(data, "application/xml");
	const apts = xml.querySelectorAll("item");
	const totalCount = xml.querySelector("totalCount");

	return { apts, totalCount };
};
