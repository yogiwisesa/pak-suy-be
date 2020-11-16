declare module 'nodejs-bca-scraper' {
  interface ISaldo {
    rekening: String,
    saldo: Number
  }

  interface ISettlement {
    tanggal: String,
    keterangan: String,
    cab: String,
    nominal: Number,
    mutasi: String
  }

  export function getBalance(username: String, password: String): Promise<ISaldo>
  
  export function getSettlement(username: String, password: String): Promise<[ISettlement]>
} 