// regcode로 주소 정보 구해오는 함수
export const fetchJuso = async (regcode) => {
	const url = "https://grpc-proxy-server-mkvo6j4wsq-du.a.run.app";
	const jusoUrl = `${url}/v1/regcodes?regcode_pattern=${regcode}`;
	const response = await fetch(jusoUrl);
	const data = await response.json();

	const result = [];
	data.regcodes.forEach((item) => result.push(item));

	return result;
};

