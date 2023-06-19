const rule1 = async (var1) => {
  const modelCollection = mongo.collection("property")
  const modelData = await modelCollection
    .aggregate([
      { $match: { _id: ObjectId(var1) } },
      { $lookup: { from: "authority", let: { let1: $_id }, pipeline: [{ $match: { $expr: { eq: [$propertyId, $$let1] } } }], as: "authority" } },
      { $lookup: { from: "maps", let: { let2: $_id }, pipeline: [{ $match: { $expr: { eq: [$propertyId, $$let2] } } }], as: "maps" } },
      {
        $lookup: {
          from: "leads",
          let: { let3: $_id },
          pipeline: [
            { $match: { $expr: { eq: [$pid, $$let3] } } },
            {
              $lookup: {
                from: "tags",
                let: { let4: $_id },
                pipeline: [{ $match: { $expr: { eq: [$typeToId, $$let4] } } }, { $match: { $expr: { eq: [$typeFormId, var2] } } }],
                as: "isTagged",
              },
            },
            {
              $lookup: {
                from: "users",
                let: { let5: $salesUserID },
                pipeline: [{ $match: { _id: ObjectId($$let5) } }, { $project: { name: 1 } }],
                as: "createdBy",
              },
            },
            { $project: { cheque: 1, buildup: 1, comments: 1 } },
          ],
          as: "output",
        },
      },
    ])
    .toArray()

  return {
    collectionName: "property",
    ...modelData,
  }
}
