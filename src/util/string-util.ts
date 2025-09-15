const stringHasValue = (str: string | null | undefined): boolean => {
  return (
    str !== null &&
    str !== undefined &&
    typeof str === "string" &&
    str.trim() !== ""
  );
};

function escapeRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").trim();
}

const normalizePhoneNumber = (
  phoneNumber: string | null | undefined,
): string | null => {
  if (!phoneNumber || typeof phoneNumber !== "string") {
    return null;
  }

  let cleanedNumber = phoneNumber.replace(/[-\s]/g, "");

  if (cleanedNumber.startsWith("+639") && cleanedNumber.length === 13) {
    if (/^\+639\d{9}$/.test(cleanedNumber)) {
      return cleanedNumber.trim();
    }
  } else if (cleanedNumber.startsWith("639") && cleanedNumber.length === 12) {
    if (/^639\d{9}$/.test(cleanedNumber)) {
      return "+".concat(cleanedNumber).trim();
    }
  } else if (cleanedNumber.startsWith("09") && cleanedNumber.length === 11) {
    if (/^09\d{9}$/.test(cleanedNumber)) {
      return "+63".concat(cleanedNumber.substring(1)).trim();
    }
  } else if (cleanedNumber.startsWith("9") && cleanedNumber.length === 10) {
    if (/^9\d{9}$/.test(cleanedNumber)) {
      return "+63".concat(cleanedNumber).trim();
    }
  }
  console.warn(
    `Could not normalize phone number: "${phoneNumber}" to a valid PH mobile format.`,
  );
  return null;
};

interface SplitName {
  first_name: string;
  middle_name: string;
  last_name: string;
}

const extractNames = (name: string): SplitName => {
  // Assuming format of name is LAST NAME, FIRST NAME MIDDLE NAME
  const nameParts = name.split(",").map((part) => part.trim());
  const last_name = nameParts[0] || "";
  const first_middle = nameParts[1]?.split(" ") || [];
  const first_name = first_middle[0] || "";
  const middle_name =
    first_middle.length > 1 && first_middle[first_middle.length - 1] !== first_name
      ? first_middle.slice(1).join(" ")
      : "";

  return {
    first_name: first_name.trim().replace(/[-\s]/g, ""),
    middle_name: middle_name.trim().replace(/[-\s]/g, ""),
    last_name: last_name.trim().replace(/[-\s]/g, ""),
  };
};

export { stringHasValue, escapeRegex, normalizePhoneNumber, extractNames };
