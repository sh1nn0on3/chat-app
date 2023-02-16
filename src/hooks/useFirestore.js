import { useEffect, useState } from "react";
import { db } from "../firebase/config";

const useFirbase = (collection, condition) => {
  // console.log({collection ,condition })

  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    let collectionRef = db.collection(collection).orderBy("createAt");

    // condition
    // {
    //   fieldName : "abc",
    //   operator : "==",
    //   compareValue : "abc"
    // }

    if (collection) {
      if (!condition.compareValue || !condition.compareValue.length) {
        return;
      }

      collectionRef = collectionRef.where(
        condition.fieldName,
        condition.operator,
        condition.compareValue
      );
    }

    const unsubscibe = collectionRef.onSnapshot((snapshot) => {
      const documents = snapshot.docs.map(
        (doc) => ({
          ...doc.data(),
          id: doc.id,
        })
        //   console.log({   data, snapshot, docs: snapshot.docs });
      );

      setDocuments(documents);
    });

    return unsubscibe;
  }, [collection, condition]);
  return documents;
};

export default useFirbase;


