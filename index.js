const { decodeAddress, encodeAddress } = require("@polkadot/keyring");
const { hexToU8a, isHex, u8aToHex } = require("@polkadot/util");
const fs = require("fs");

async function main() {
  const ss58Format = 6;

  let newList = [];

  // 读取csv文件
    let csvData = fs.readFileSync("input.csv", "utf-8");
    let csvDataArray = parseCSV(csvData);

  for (const account of csvDataArray) {
    // 如果是有效地址，刚对地址进行重新编码
    let publicKey = isHex(account) ? hexToU8a(account) : decodeAddress(account);
    let convertedAccount = encodeAddress(publicKey, ss58Format);

    if (convertedAccount) {
        newList.push({
          original: account,
          publicKey: u8aToHex(publicKey),
          converted: convertedAccount,
        });
      }
    }

    console.log(`newList: ${JSON.stringify(newList)}}`)

      // 将解析后的数据写入新的CSV文件
      const newData = convertToCSV(newList);
      fs.writeFileSync("output.csv", newData);
}


// 解析CSV数据
function parseCSV(csvData) {
  const lines = csvData.split("\n");
  const result = [];

  for (const line of lines) {
    const fields = line.trim();
    result.push(fields);
  }

  return result;
}


// 将JSON数据转换为CSV格式
function convertToCSV(jsonData) {
    const header = Object.keys(jsonData[0]).join(',');
    const rows = jsonData.map(item => Object.values(item).join(','));
    return header + '\n' + rows.join('\n');
  }

main();
