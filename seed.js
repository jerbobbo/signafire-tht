module.exports = async function({User, Index, Access}) {
  const foo = await User.create({
    name: 'foo',
  });
  const bar = await User.create({
    name: 'bar',
  });
  const bazz = await User.create({
    name: 'bazz',
  });
  const fooIndex = await Index.create({
    name: 'foo_index',
  })
  const barIndex = await Index.create({
    name: 'bar_index',
  })
  await Access.create({
    userId: foo.id,
    indexId: fooIndex.id,
    read: true
  })
  await Access.create({
    userId: foo.id,
    indexId: barIndex.id,
    read: false
  })
  await Access.create({
    userId: bar.id,
    indexId: barIndex.id,
    read: true
  })
  await Access.create({
    userId: bar.id,
    indexId: fooIndex.id,
    read: false
  })
}