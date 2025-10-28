
import phone1 from './iphone-1.2.jpg'
import phone2 from './iphone-5.jpg'
import phone3 from './iphone-1.1.jpg'
import phone4 from './iphone-1.2.jpg'
import phone5 from './iphone-1.3.jpg'
import phone6 from './iphone-2.jpg'
import phone7 from './iphone-2.1.jpg'
import phone8 from './iphone-3.jpg'
import phone9 from './iphone-4.jpg'
import phone10 from './iphone-4.1.jpg'


import laptop1 from './lap-1.jpg'
import laptop2 from './lap-1.1.jpg'
import laptop3 from './lap-2.jpg'
import laptop4 from './lap-4.jpg'
import laptop5 from './lap-4.1.jpg'
import laptop6 from './lap-5.jpg'
import laptop7 from './lap-5.1.jpg'
import laptop8 from './lap-6.jpg'
import laptop9 from './lap-6.1.jpg'
import laptop10 from './lap-7.jpg'


import shirt1 from './p-7.jpg'
import shirt2 from './p-7.1.jpg'
import shirt3 from './p-3.jpg'
import shirt4 from './p-3.1.jpg'
import shirt5 from './p-1.jpg'
import shirt6 from './p-1.1.jpg'
import shirt7 from './p-6.jpg'
import shirt8 from './p-5.jpg'
import shirt9 from './p-4.jpg'
import shirt10 from './p-7.3.jpg'


import menshoe1 from './shoe-1.jpg'
import menshoe2 from './shoe-1.1.jpg'
import menshoe3 from './shoe-2.jpg'
import menshoe4 from './shoe-2.1.jpg'
import menshoe5 from './shoe-3.jpg'
import menshoe6 from './shoe-3.1.jpg'
import menshoe7 from './shoe-4.jpg'
import menshoe8 from './shoe-4.1.jpg'
import menshoe9 from './shoe-5.jpg'
import menshoe10 from './shoe-5.1.jpg'


import jeans1 from './trou-1.jpg'
import jeans2 from './trou-2.jpg'
import jeans3 from './trou-3-1.jpg'
import jeans4 from './trou-3.jpg'
import jeans5 from './trou-4.jpg'
import jeans6 from './trou-4-1.jpg'
import jeans7 from './trou-5.jpg'
import jeans8 from './trou-8.jpg'
import jeans9 from './trou-6.jpg'
import jeans10 from './trou-6-1.jpg'


import dress1 from './w-d-1.jpg'
import dress2 from './w-d-1.1.jpg'
import dress3 from './w-d-2.jpg'
import dress4 from './w-d-2.1.jpg'
import dress5 from './w-d-3.jpg'
import dress6 from './w-d-4.jpg'
import dress7 from './w-d-4.1.jpg'
import dress8 from './w-d-5.jpg'
import dress9 from './w-d-5.1.jpg'
import dress10 from './w-d-6.jpg'


import womenshoe1 from './w-s-1.svg'
import womenshoe2 from './womenshoe10.jpg'
import womenshoe3 from './w-s-2.jpg'
import womenshoe4 from './w-s-2-1.jpg'
import womenshoe5 from './w-s-3.jpg'
import womenshoe6 from './w-s-3-1.jpg'
import womenshoe7 from './w-s-3-2.jpg'
import womenshoe8 from './w-s-4-1.jpg'
import womenshoe9 from './w-s-4.jpg'

let all_products = [
  // Phones (37)
  { id: 1, name: "Phone 1", category: "electronics", image: phone1, new_price: 320, old_price: 370 },
  { id: 2, name: "Phone 2", category: "electronics", image: phone2, new_price: 280, old_price: 330 },
  { id: 3, name: "Phone 3", category: "electronics", image: phone3, new_price: 350, old_price: 400 },
  { id: 4, name: "Phone 4", category: "electronics", image: phone4, new_price: 420, old_price: 480 },
  { id: 5, name: "Phone 5", category: "electronics", image: phone5, new_price: 310, old_price: 360 },
  { id: 6, name: "Phone 6", category: "electronics", image: phone6, new_price: 340, old_price: 400 },
  { id: 7, name: "Phone 7", category: "electronics", image: phone7, new_price: 260, old_price: 310 },
  { id: 8, name: "Phone 8", category: "electronics", image: phone8, new_price: 300, old_price: 350 },
  { id: 9, name: "Phone 9", category: "electronics", image: phone9, new_price: 390, old_price: 440 },
  { id: 10, name: "Phone 10", category: "electronics", image: phone10, new_price: 280, old_price: 320 },
 

  // Laptops (23)
  { id: 11, name: "Laptop 1", category: "electronics", image: laptop1, new_price: 850, old_price: 950 },
  { id: 12, name: "Laptop 2", category: "electronics", image: laptop2, new_price: 780, old_price: 880 },
  { id: 13, name: "Laptop 3", category: "electronics", image: laptop3, new_price: 990, old_price: 1090 },
  { id: 14, name: "Laptop 4", category: "electronics", image: laptop4, new_price: 870, old_price: 970 },
  { id: 15, name: "Laptop 5", category: "electronics", image: laptop5, new_price: 910, old_price: 1010 },
  { id: 16, name: "Laptop 6", category: "electronics", image: laptop6, new_price: 760, old_price: 860 },
  { id: 17, name: "Laptop 7", category: "electronics", image: laptop7, new_price: 820, old_price: 920 },
  { id: 18, name: "Laptop 8", category: "electronics", image: laptop8, new_price: 950, old_price: 1050 },
  { id: 19, name: "Laptop 9", category: "electronics", image: laptop9, new_price: 880, old_price: 980 },
  { id: 20, name: "Laptop 10", category: "electronics", image: laptop10, new_price: 890, old_price: 990 },
  
  

  // Shirts (15)
  { id: 21, name: "Shirt 1", category: "mens", image: shirt1, new_price: 45, old_price: 60 },
  { id: 22, name: "Shirt 2", category: "mens", image: shirt2, new_price: 40, old_price: 55 },
  { id: 23, name: "Shirt 3", category: "mens", image: shirt3, new_price: 50, old_price: 65 },
  { id: 24, name: "Shirt 4", category: "mens", image: shirt4, new_price: 55, old_price: 70 },
  { id: 25, name: "Shirt 5", category: "mens", image: shirt5, new_price: 48, old_price: 60 },
  { id: 26, name: "Shirt 6", category: "mens", image: shirt6, new_price: 43, old_price: 58 },
  { id: 27, name: "Shirt 7", category: "mens", image: shirt7, new_price: 52, old_price: 66 },
  { id: 28, name: "Shirt 8", category: "mens", image: shirt8, new_price: 46, old_price: 59 },
  { id: 29, name: "Shirt 9", category: "mens", image: shirt9, new_price: 49, old_price: 62 },
  { id: 30, name: "Shirt 10", category: "mens", image: shirt10, new_price: 55, old_price: 68 },
 



  // Men Shoes (21)
  { id: 31, name: "Men Shoe 1", category: "mens", image: menshoe1, new_price: 120, old_price: 150 },
  { id: 32, name: "Men Shoe 2", category: "mens", image: menshoe2, new_price: 130, old_price: 160 },
  { id: 33, name: "Men Shoe 3", category: "mens", image: menshoe3, new_price: 140, old_price: 170 },
  { id: 34, name: "Men Shoe 4", category: "mens", image: menshoe4, new_price: 125, old_price: 155 },
  { id: 35, name: "Men Shoe 5", category: "mens", image: menshoe5, new_price: 135, old_price: 165 },
  { id: 36, name: "Men Shoe 6", category: "mens", image: menshoe6, new_price: 145, old_price: 175 },
  { id: 37, name: "Men Shoe 7", category: "mens", image: menshoe7, new_price: 150, old_price: 180 },
  { id: 38, name: "Men Shoe 8", category: "mens", image: menshoe8, new_price: 115, old_price: 140 },
  { id: 39, name: "Men Shoe 9", category: "mens", image: menshoe9, new_price: 155, old_price: 185 },
  { id: 40, name: "Men Shoe 10", category: "mens", image: menshoe10, new_price: 125, old_price: 155 },
  

  // Men Jeans (11)
  { id: 41, name: "Men Jean 1", category: "mens", image: jeans1, new_price: 70, old_price: 90 },
  { id: 42, name: "Men Jean 2", category: "mens", image: jeans2, new_price: 65, old_price: 85 },
  { id: 43, name: "Men Jean 3", category: "mens", image: jeans3, new_price: 80, old_price: 100 },
  { id: 44, name: "Men Jean 4", category: "mens", image: jeans4, new_price: 75, old_price: 95 },
  { id: 45, name: "Men Jean 5", category: "mens", image: jeans5, new_price: 68, old_price: 88 },
  { id: 46, name: "Men Jean 6", category: "mens", image: jeans6, new_price: 72, old_price: 92 },
  { id: 47, name: "Men Jean 7", category: "mens", image: jeans7, new_price: 78, old_price: 98 },
  { id: 48, name: "Men Jean 8", category: "mens", image: jeans8, new_price: 70, old_price: 90 },
  { id: 49, name: "Men Jean 9", category: "mens", image: jeans9, new_price: 74, old_price: 94 },
  { id: 50, name: "Men Jean 10", category: "mens", image:jeans10, new_price: 69, old_price: 89 },
 

  // Women Dress (24)
  { id: 51, name: "Women Dress 1", category: "women", image: dress1, new_price: 85, old_price: 105 },
  { id: 52, name: "Women Dress 2", category: "women", image: dress2, new_price: 90, old_price: 110 },
  { id: 53, name: "Women Dress 3", category: "women", image: dress3, new_price: 95, old_price: 115 },
  { id: 54, name: "Women Dress 4", category: "women", image: dress4, new_price: 80, old_price: 100 },
  { id: 55, name: "Women Dress 5", category: "women", image: dress5, new_price: 88, old_price: 108 },
  { id: 56, name: "Women Dress 6", category: "women", image: dress6, new_price: 92, old_price: 112 },
  { id: 57, name: "Women Dress 7", category: "women", image: dress7, new_price: 85, old_price: 105 },
  { id: 58, name: "Women Dress 8", category: "women", image: dress8, new_price: 90, old_price: 110 },
  { id: 59, name: "Women Dress 9", category: "women", image: dress9, new_price: 94, old_price: 114 },
  { id: 60, name: "Women Dress 10", category: "women", image: dress10, new_price: 89, old_price: 109 },
  

  // Women Shoes (9)
  { id: 61, name: "Women Shoe 1", category: "women", image: womenshoe1, new_price: 110, old_price: 140 },
  { id: 62, name: "Women Shoe 2", category: "women", image: womenshoe2, new_price: 120, old_price: 150 },
  { id: 63, name: "Women Shoe 3", category: "women", image: womenshoe3, new_price: 115, old_price: 145 },
  { id: 64, name: "Women Shoe 4", category: "women", image: womenshoe4, new_price: 125, old_price: 155 },
  { id: 65, name: "Women Shoe 5", category: "women", image: womenshoe5, new_price: 130, old_price: 160 },
  { id: 66, name: "Women Shoe 6", category: "women", image: womenshoe6, new_price: 118, old_price: 148 },
  { id: 67, name: "Women Shoe 7", category: "women", image: womenshoe7, new_price: 127, old_price: 157 },
  { id: 68, name: "Women Shoe 8", category: "women", image: womenshoe8, new_price: 124, old_price: 154 },
  { id: 70, name: "Women Shoe 9", category: "women", image: womenshoe9, new_price: 119, old_price: 149 }
];


export default all_products


