interface NumberLogicParams {
  oldValue: string;
  newValue: string;
  allowZero?: boolean;
}

function newNumberFieldLogic({
  oldValue,
  newValue,
}: NumberLogicParams): string {
  let returnValue: string;

  if (oldValue.length === 10 && newValue.length > 10) {
    returnValue = oldValue;
    return returnValue;
  }

  if (newValue.length < oldValue.length) {
    // Erase or replace
    if (newValue === "") {
      // Erase all
      returnValue = "0";
    } else if (newValue === ".") {
      // replace all with dot
      returnValue = "0.";
    } else if (newValue.split(".").length > 2) {
      returnValue = oldValue;
    } else {
      returnValue = newValue;
    }
  } else {
    // write new caracter
    if (
      (oldValue.includes(".") &&
        oldValue.indexOf(".") + 3 === oldValue.length &&
        newValue.split(".")[1].length > 2) ||
      newValue.split(".").length > 2
    ) {
      returnValue = oldValue;
      return returnValue;
    }
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
        if (oldValue === "0") {
          // If 0 already exists and writing before dot. replace it
          returnValue = newValue.slice(-1);
        } else {
          returnValue = newValue;
        }
        /* if (oldValue.includes(".")) {
            REGLA GENERAL
        } */
        // if writing after dot just allow 2 digits

        break;
      case "0":
        if (oldValue === "0") {
          // if already a 0 dont write to avoid 00001 leave 0 alone
          returnValue = oldValue;
        } else {
          returnValue = newValue;
        }
        break;
      case ".":
        if (!oldValue.includes(".")) {
          returnValue = newValue;
        } else {
          returnValue = oldValue;
        }
        break;
      default:
        returnValue = oldValue;
    }
  }

  return returnValue;
}

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

export { numberFieldLogic, newNumberFieldLogic };
