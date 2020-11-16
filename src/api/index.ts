import Axios from 'axios';
import { load } from 'ts-dotenv';

const env = load({
  TELEGRAF: String,
  KATA_TOKEN: String,
  KATA_NL_ID: String
});

const configAxios = {
  baseURL: `https://geist.kata.ai/nlus/${env.KATA_NL_ID}`,
  headers: {
    Authorization: `Bearer ${env.KATA_TOKEN}`
  }
};
const axios = Axios.create(configAxios);

export type KataAiQuestion = {
  type: string;
  value: string;
  start: number;
  end: number;
  score: number;
  label: string;
};

export type KataAiPredict = {
  result: {
    question: KataAiQuestion[];
    // eslint-disable-next-line camelcase
    search_wiki: KataAiQuestion[];
    kata: KataAiQuestion[];
  };
};

export const KataPredict = (text: string) => {
  return axios.post<KataAiPredict>('/predict', { text });
};
