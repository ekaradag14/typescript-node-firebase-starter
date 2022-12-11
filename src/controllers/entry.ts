import { Response } from 'express';
import * as GenericRepository from '../repositories/genericRepository';
import * as ResponseConverter from '../utils/responseConverter';

type EntryType = {
  title: string;
  text: string;
  coverImageUrl: string;
};

type Request = {
  body: EntryType;
  params: { entryId: string };
};

export const addEntry = async (req: Request, res: Response) => {
  const { title, text } = req.body;
  let addedEntry;
  try {
    const entryObject = {
      title,
      text,
    };
    addedEntry = await GenericRepository.addDocument(entryObject, 'entries');
  } catch (error: any) {
    res.status(500).json(error?.message);
  }
  ResponseConverter.successful(res, addedEntry);
};
