/**
 * 중복 없는 4자리 숫자 코드 생성
 */
export function genVerificationCode(): string {
  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let code = '';

  for (let i = 0; i < 4; i++) {
    const index = Math.floor(Math.random() * digits.length);
    code += digits[index];
    digits.splice(index, 1); // 중복 숫자 제거
  }

  return code;
}
