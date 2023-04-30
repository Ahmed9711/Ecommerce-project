# Ecommerce-project
Ecommerce backend system using node.js, express and mongoose


## Techonologies used in this application
  * Express.js
  * MongoDB (mongoose.js)
  * Node.js
  * bcryptjs
  * jsonwebtoken.js
  * joi.js (validation)
  * Nodemailer (Using Gmail)
  * multer.js
  * Cloudinary
  * Stripe

## App is divided into 10 modules
  * Auth
  * User
  * Brand
  * Category
  * Subcategory
  * Cart
  * Product
  * Order
  * Coupon
  * Review
  
## User and Auth module functionalities
  * Sign up - send confirmation email with link
  * Confirm email - Clicking on the link in the confirmation mail
  * Login
  * Log out
  * Get user account info
  * Update user account
  * Upload Profile Picture (Local - cloud)

## Brand module functionalities - Admin access only
  * Add brand with picture
 
## Category module functionalities - Admin access only
 * Create Category
 * Update Category
 
 ## Subcategory module functionalities - Admin access only
   * Create SubCategory with it's associated category
   * Update Subcategory
   
## Cart module functionalities
  * Add to cart (adding product to the user's cart)
  

## Product module functionalities - Admin access only
  * Add product
  * Update product
  * Get product list
  
## Order module functionalities
  * Create Order (from cart or a selected products)
  * Cancel Order
  
## Coupon module functionalities - Admin access only
  * Create Coupon
  * Update Coupon
  * Validate Coupon
  
## Review module functionalities
  * Add review to product
