import { admin, db } from '../config/firebase';

export const getAllDocs = async (
  collection: string,
  orderField: string,
  order: FirebaseFirestore.OrderByDirection = 'desc'
) => {
  let docs;
  const currentCollection = db.collection(collection);
  if (orderField && order) {
    currentCollection.orderBy(orderField, order);
  }
  await currentCollection.get().then((data) => {
    const docsData: FirebaseFirestore.DocumentData[] = [];
    data.forEach((doc: FirebaseFirestore.DocumentData) => {
      docsData.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    docs = docsData;
  });
  return docs;
};

export const getLatestUserDocs = async (uid: string, collection: string) => {
  let docs;
  await db
    .collection(collection)
    .where('owner.uid', '==', uid)
    .orderBy('createdAt', 'desc')
    .limit(12)
    .get()
    .then((data) => {
      const docsData: FirebaseFirestore.DocumentData[] = [];
      data.forEach((doc) => {
        docsData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      docs = docsData;
    });
  return docs;
};
export const getUserDocsForPage = async (
  uid: string,
  collection: string,
  page: number
) => {
  let docs;
  await db
    .collection(collection)
    .where('owner.uid', '==', uid)
    .orderBy('createdAt', 'desc')
    .limit(page * 12)
    .get()
    .then((data) => {
      const docsData: FirebaseFirestore.DocumentData[] = [];
      data.forEach((doc) => {
        docsData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      docs = docsData;

      docs = docs.slice((page - 1) * 12, page * 12);
    });

  return docs;
};

export const addDocument = async (
  doc: Record<string, unknown>,
  collection: string
) => {
  let responseData;
  await db
    .collection(collection)
    .add(doc)
    .then((responseDoc) => {
      const resDocItem = doc; // TODO: Refactor Here, why resBulletNewItem?
      resDocItem.id = responseDoc.id;
      responseData = resDocItem;
    });
  return responseData;
};

export const addMultipleDocuments = async (
  docs: Record<string, unknown>[],
  collection: string
) => {
  const batch = db.batch();
  docs.forEach((doc) => {
    const docRef = db.collection(collection).doc();
    batch.set(docRef, doc);
  });
  return batch.commit();
};

export const deleteDocument = async (docPath: string) => {
  //   const document = db.doc(docPath);
  return db.doc(docPath).delete();
  //   await document.get().then((doc: FirebaseFirestore.DocumentData) => {
  //     if (!doc.exists) {
  //       return 'No document to delete.';
  //     } else {
  //       return document.delete();
  //     }
  //   });
};

export const editDocument = async (
  updates: Record<string, unknown>,
  docId: string,
  collection: string
) => {
  delete updates.id;
  const document = db.collection(collection).doc(`${docId}`);
  await document.get().then((doc) => {
    if (!doc.exists) {
      throw new Error('ErrorMessages.database.noItem');
    }
    // if (doc.data().owner !== uid) {
    //   throw new Error(ErrorMessages.user.insufficientRights);
    // } // ACCEPT BOTH FROM USER AND CHANNEL LEAD
    return document.update(updates);
  });
};

export const getSingleDocument = async (id: string, collection: string) => {
  let doc: FirebaseFirestore.DocumentData | undefined;
  const document = db.collection(collection).doc(`${id}`);
  await document.get().then((item) => {
    if (!item.exists) {
      throw new Error('ErrorMessages.database.noItem');
    }
    doc = item.data();
    if (doc?.id) {
      doc.id = item.id;
    }
  });
  return doc;
};

export const checkSingleFileExists = async (path: string) => {
  let status;
  const storageFile = admin.storage().bucket().file(path);
  await storageFile.exists().then((exists) => {
    if (exists[0]) {
      status = true;
    } else {
      status = false;
    }
  });
  return status;
};

export const getManyDocs = async (idArray: string[], collection: string) => {
  let docs: admin.firestore.DocumentData[] = [];
  const refs = idArray.map((id) => db.collection(collection).doc(`${id}`));
  docs = await db.getAll(...refs);
  const realDocs = docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  //   realDocs = utilFuncs.sortDescByCreatedAt(realDocs);
  return realDocs;
};

export const getAllDocuments = async (collection: string) => {
  const collectionDocs: FirebaseFirestore.DocumentData[] = [];
  let collectionDoc;

  const document = db.collection(collection);
  await document.get().then((docs) => {
    docs.forEach((doc) => {
      collectionDoc = doc.data();
      collectionDoc.id = doc.id;
      collectionDocs.push(collectionDoc);
    });
  });
  return collectionDocs;
};

export const getAllDocumentsMatching = async (
  collection: string,
  attribute: string,
  value: string | number
) => {
  let docs;
  await db
    .collection(collection)
    .where(attribute, '==', value)
    .get()
    .then((data) => {
      const docsData: FirebaseFirestore.DocumentData[] = [];

      data.forEach((doc) => {
        docsData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      docs = docsData;
    });
  return docs;
};

export const getDocsForPage = async (collection: string, page: number) => {
  const itemPerPage = 5;

  let docs;
  await db
    .collection(collection)
    .orderBy('createdAt', 'desc')
    .limit(page * itemPerPage)
    .get()
    .then((data) => {
      const docsData: FirebaseFirestore.DocumentData[] = [];
      data.forEach((doc) => {
        docsData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      docs = docsData;

      docs = docs.slice((page - 1) * itemPerPage, page * itemPerPage);
    });

  return docs;
};

// const loopThrough = async (collection: string) => {
//     let docs;
//     const collRef = db.collection(collection);
//     await collRef.get().then((data) => {
//       const docsData: FirebaseFirestore.DocumentData[] = [];
//       data.forEach((doc) => {
//         const docRef = collRef.doc(doc.id);

//         db.collection('channels')
//           .doc(doc.data().channel)
//           .get()
//           .then((channel) => {
//             let contentArray = [];
//             if (channel.data().sections) {
//               channel.data().sections.forEach((section) => {
//                 let filteredArray = doc
//                   .data()
//                   .contentIdArray.filter(
//                     (element) => element.section === section.title
//                   );
//                 filteredArray = filteredArray.map(async (item) => {
//                   if (item.type === 'inDepth') {
//                     await db
//                       .collection('inDepths')
//                       .doc(item.id)
//                       .get()
//                       .then((inDepth) => {
//                         item.owner = inDepth.data().owner;
//                         item.content = inDepth.data().content;
//                         item.title = inDepth.data().title;
//                       });
//                   } else {
//                     await db
//                       .collection('bulletNews')
//                       .doc(item.id)
//                       .get()
//                       .then((bulletNews) => {
//                         item.content = bulletNews.data().content;
//                       });
//                   }
//                   return item;
//                 });
//                 contentArray = [...contentArray, ...filteredArray];
//               });
//             }

//             // console.log(contentArray);
//             // docRef.update({
//             //   owner: {
//             //     uid: user.id,
//             //     firstName: user.data().firstName,
//             //     lastName: user.data().lastName,
//             //     profileImageURL: user.data().profileImage.url,
//             //   },
//             // });
//           });
//       });
//     });

//     return docs;
//   };
