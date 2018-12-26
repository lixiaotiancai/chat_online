const mock_data = []

for (let i = 1; i < 20; i++) {
    mock_data.push({
        "id": i,
        "date": +new Date(),
        "visit": Math.floor(Math.random() * 100),
        "title": `Test title ${i}`,
        "cover": 'http://imweb-io-1251594266.cos.ap-guangzhou.myqcloud.com/6842cd337d2e46f81020738301c8beb7.jpg',
        "intro": 'this is test article from mock blog data',
        "content": `
    <h1>acticle ${i}</h1>
    <p>this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} this is article ${i} </p>
    `
    })
}


module.exports = mock_data