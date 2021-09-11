import CONSTANTS from '../Constants';

export function mobileNumber(number) {
  const reg = CONSTANTS.regexExpression.VALIDATION_MOB;

  return reg.test(number);
}

