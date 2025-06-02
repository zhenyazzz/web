const person = {
    name: "John",
    age: 20,
    sayHi: () => {
        console.log("Hello");
    }
}
for (let key in person) {
    console.log(person[key]);
}

const products = [
    { id: 1, name: "iPhone 13", price: 79990, stock: 1, image: "images/iphone13.png" },
    { id: 2, name: "Samsung Galaxy S21", price: 69990, stock: 2, image: "images/samsung21.png" },
    { id: 3, name: "Xiaomi Mi 11", price: 59990, stock: 3, image: "images/xiaomi11.png" },
    { id: 4, name: "Poco X6 Pro", price: 69990, stock: 1, image: "images/PocoX6Pro.png" },
    { id: 5, name: "Google Pixel 7", price: 59990, stock: 2, image: "images/GooglePixel.png" },
    
];

const getMaxStock = () => {
    return Math.max(...products.map(product => product.stock));
};

const createTable = () => {
    const table = document.getElementById('productTable');
    const maxStock = getMaxStock();
    
    const headerRow = document.createElement('tr');
    const emptyCell = document.createElement('th');
    headerRow.appendChild(emptyCell);
    
    for (let i = 1; i <= maxStock; i++) {
        const th = document.createElement('th');
        th.textContent = `${i} шт.`;
        headerRow.appendChild(th);
    }
    
    table.appendChild(headerRow);
    
    products.forEach(product => {
        const row = document.createElement('tr');
        
        const idCell = document.createElement('td');
        idCell.textContent = `Артикул ${product.id}`;
        row.appendChild(idCell);
        
        for (let i = 1; i <= maxStock; i++) {
            const cell = document.createElement('td');
            
            if (i === product.stock) {
                const img = document.createElement('img');
                img.src = product.image;
                img.classList.add('product-image');
                img.alt = product.name;
                
                const showPrice = ((prod) => {
                    return () => {
                        const priceInfo = document.getElementById('priceInfo');
                        priceInfo.textContent = `${prod.name} - Цена: ${prod.price} руб.`;
                    };
                })(product);
                
                img.addEventListener('click', showPrice);
                
                cell.appendChild(img);
            }
            
            row.appendChild(cell);
        }
        
        table.appendChild(row);
    });
};

const getMinPriceProduct = () => {
    return products.reduce((min, product) => 
        product.price < min.price ? product : min, products[0]);
};

const getMaxPriceProduct = () => {
    return products.reduce((max, product) => 
        product.price > max.price ? product : max, products[0]);
};

const getAveragePrice = () => {
    const sum = products.reduce((total, product) => total + product.price, 0);
    return Math.round(sum / products.length);
};

document.addEventListener('DOMContentLoaded', () => {
    createTable();
    
    document.getElementById('minPriceBtn').addEventListener('click', () => {
        const minProduct = getMinPriceProduct();
        document.getElementById('priceInfo').textContent = 
            `Товар с минимальной ценой: ${minProduct.name} - ${minProduct.price} руб.`;
    });
    
    document.getElementById('maxPriceBtn').addEventListener('click', () => {
        const maxProduct = getMaxPriceProduct();
        document.getElementById('priceInfo').textContent = 
            `Товар с максимальной ценой: ${maxProduct.name} - ${maxProduct.price} руб.`;
    });
    
    document.getElementById('avgPriceBtn').addEventListener('click', () => {
        const avgPrice = getAveragePrice();
        document.getElementById('priceInfo').textContent = `Средняя цена всех товаров: ${avgPrice} руб.`;
    });
});
