let eventBus = new Vue()

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
    <ul>
      <li v-for="detail in details">{{ detail }}</li>
    </ul>`
})

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
   <div class="product">
	<div class="product-image">
                <img :src="image" :alt="altText"/>
            </div>
            <div class="product-info">
                <h1>{{ title }}</h1>
                <p>{{ description }}</p>
             <span v-if="onSale">{{ sale }}</span>
                <a :href="link">More products like this</a>
                <p v-if="inStock">In stock</p>
                <p v-else :class="{ outOfStock: !inStock }">Out of stock</p>
                <div class="color-box"
                     v-for="(variant, index) in variants"
                     :key="variant.variantId"
                     :style="{ backgroundColor:variant.variantColor }"
                     @mouseover="updateProduct(index)">
                </div>
                <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to cart</button>
                <button v-on:click="deleteCart">Delete cart</button>
            </div> 
           <product-tabs :reviews="reviews" :shipping="shipping" :details="details"></product-tabs>
   </div>
 `,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            description: "A pair of warm, fuzzy socks",
            selectedVariant: 0,
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            inventory: 100,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10,
                    variantSale: "not on Sale"
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0,
                    variantSale: "on Sale"
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            onSale: "On sale",
            reviews: []
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart',
                this.variants[this.selectedVariant].variantId);
        },
        deleteCart() {
            this.$emit('delete-from-cart',
                this.variants[this.selectedVariant].variantId);
        },

        updateProduct(index) {
            this.selectedVariant = index;
        },
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale() {
            return this.brand + ' ' + this.product + ' ' + this.variants[this.selectedVariant].variantSale;
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        },
    }
})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        },
        shipping: {
            required: true
        },
        details: {
            type: Array,
            required: true
        }
    },
    template: `
   <div>   
       <ul>
         <span class="tab" 
         :class="{ activeTab: selectedTab === tab }" 
         v-for="(tab, index) in tabs" 
         @click="selectedTab = tab">{{ tab }}</span>
       </ul>
       <div v-show="selectedTab === 'Reviews'">
         <p v-if="!reviews.length">There are no reviews yet.</p>
         <ul>
           <li v-for="review in reviews">
           <p>{{ review.name }}</p>
           <p>Rating: {{ review.rating }}</p>
           <p>Recommend: {{ review.recommend }}</p>
           <p>{{ review.review }}</p>
           </li>
         </ul>
       </div>
       <div v-show="selectedTab === 'Make a Review'">
         <product-review></product-review>
       </div>
       <div v-show="selectedTab === 'Shipping'">
            <p>Shipping: {{ shipping }}</p>
        </div>
            
        <div v-show="selectedTab === 'Details'">
            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>
        </div>
     </div>
 `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
            selectedTab: 'Reviews',
        }
    },
})

Vue.component('product-review', {
    template: `
   <form class="review-form" @submit.prevent="onSubmit" v-on:keyup.delete = "onSubmit">
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name" required>
    </p>
    <p v-for="error in name_error">{{ error }}</p>

     <p>
       <label for="review">Review:</label>
       <textarea id="review" v-model="review" required></textarea>
     </p>
     <p v-for="error in review_error">{{ error }}</p>
    
     <p>
       <label :class="{ errors: !rating }" for="rating">Rating:</label>
       <select id="rating" v-model.number="rating">
         <option>5</option>
         <option>4</option>
         <option>3</option>
         <option>2</option>
         <option>1</option>
       </select>
       <p v-for="error in rating_error">{{ error }}</p>
       <p :class="{ errors: !recommend }">Would you recommend this product?</p>
       <input type="radio" id="yes" value="????????????????????" v-model="recommend">
       <label for="yes">????????????????????</label>
       <input type="radio" id="no" value="???? ????????????????????" v-model="recommend">
       <label for="no">???? ????????????????????</label>
     <p>
     <p v-for="error in recommend_error">{{ error }}</p>
       <input type="submit" value="Submit"> 
     </p>

</form>
 `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            name_error: [],
            review_error: [],
            rating_error: [],
            recommend_error: [],
        }
    },
    methods: {
        onSubmit() {
            this.name_error = []
            this.review_error = []
            this.rating_error = []
            this.recommend_error = []
            if(this.name && this.review && this.rating && this.recommend) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend,
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommend = null
            } else {
                if(!this.name) this.name_error.push("Name required.")
                if(!this.review) this.review_error.push("Review required.")
                if(!this.rating) this.rating_error.push("Rating required.")
                if(this.recommend) this.recommend_error.push("Recommendation required.")
            }
        }
    }
})

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        deleteCart(id) {
            for (let i = this.cart.length - 1; i >= 0; i--) {
                if (this.cart[i] === id) {
                    this.cart.splice(i, 1);
                }
            }
        },
    }
})