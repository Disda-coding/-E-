import CryptoJS from 'crypto-js/crypto-js'

const KEY = CryptoJS.enc.Utf8.parse('412ADDSSFA342442');
const IV = CryptoJS.enc.Utf8.parse('412ADDSSFA342442');// 偏移量
/**
 * AES加密 ：字符串 key iv  返回base64
 */
export function Encrypt(word, keyStr) {
    let key = KEY;
    let iv = IV;

    if (keyStr) {
        key = CryptoJS.enc.Utf8.parse(keyStr);
    }

    let srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    });

    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);

}
/**
 * AES 解密 ：字符串 key iv  返回base64
 *
 */
export function Decrypt(word, keyStr) {
    let key  = KEY;
    let iv = IV;

    if (keyStr) {
        key = CryptoJS.enc.Utf8.parse(keyStr);
    }

    let base64 = CryptoJS.enc.Base64.parse(word);
    let src = CryptoJS.enc.Base64.stringify(base64);

    var decrypt = CryptoJS.AES.decrypt(src, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    });

    var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}
