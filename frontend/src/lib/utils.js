
export const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);


// export const capitalize = (str) => {
//   if (!str || typeof str !== "string") return "";
//   return str.charAt(0).toUpperCase() + str.slice(1);
// };

// export const truncateText = (text, maxLength = 100) => {
//   if (!text || text.length <= maxLength) return text;
//   return `${text.substring(0, maxLength)}...`;
// };

// export const formatLanguageWithFlag = (language) => {
//   const flagMap = {
//     english: "🇺🇸", spanish: "🇪🇸", french: "🇫🇷", german: "🇩🇪",
//     italian: "🇮🇹", portuguese: "🇵🇹", chinese: "🇨🇳", japanese: "🇯🇵",
//     korean: "🇰🇷", arabic: "🇸🇦", russian: "🇷🇺", hindi: "🇮🇳",
//   };
//   const flag = flagMap[language.toLowerCase()] || "🌍";
//   return `${flag} ${capitalize(language)}`;
// };

// /**
//  * Formats date for UI (e.g., "Nov 11, 2025").
//  */
// export const formatDate = (date, locale = "en-US") => {
//   if (!date) return "";
//   return new Intl.DateTimeFormat(locale, {
//     year: "numeric", month: "short", day: "numeric",
//   }).format(new Date(date));
// };

// /**
//  * Validates email simply.
//  */
// export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);