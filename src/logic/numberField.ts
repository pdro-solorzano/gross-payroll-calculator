function newNumberFieldLogic(
  oldValue: number,
  newValue: number,
  allowZero?: boolean,
) {}

function numberFieldLogic(
  oldValue: string,
  newValue: string,
  isHoursData?: boolean,
) {
  let returnValue;
  // Erase digits or replacing digits
  if (isHoursData && Number(newValue) >= 24) {
    returnValue = oldValue;
  } else {
    if (newValue === "") {
      // -> erasing all digits
      returnValue = "0";
    } else if (newValue.length < oldValue.length) {
      // erasing just a part
      returnValue = newValue;
    } else {
      // Adding digits
      switch (newValue.slice(-1)) {
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          // erase beginning 0 if is not there a dot
          if (Number(oldValue) === 0 && !oldValue.includes(".")) {
            return newValue.slice(-1);
          } else if (
            oldValue.includes(".") &&
            oldValue.indexOf(".") + 3 === oldValue.length
          ) {
            // Avoid to add new digits if the value already has 2 decimals
            returnValue = oldValue;
          } else {
            returnValue = newValue;
          }
          break;
        case ".":
          if (oldValue === "" || oldValue === null) {
            // If dot is the first digit entered add dot but whit a 0 preceded
            returnValue = "0.";
          } else if (oldValue.includes(".")) {
            // Must be only one dot
            returnValue = oldValue;
          } else {
            returnValue = newValue;
          }
          break;
        case "0":
          if (
            oldValue.includes(".") &&
            oldValue.indexOf(".") + 3 === oldValue.length
          ) {
            // avoid add new digits if the value already has 2 decimals
            returnValue = oldValue;
          } else if (oldValue.includes(".")) {
            // allow add 0 if there is a dot
            returnValue = newValue;
          } else if (
            (oldValue === "" || oldValue === null || Number(oldValue) === 0) &&
            !oldValue.includes(".")
          ) {
            // prevent 0 on the left if there is not a dot .
            returnValue = "0";
          } else {
            returnValue = newValue;
          }
          break;
        default:
          returnValue = oldValue;
          break;
      }
    }
  }

  return returnValue;
}

export { numberFieldLogic };
