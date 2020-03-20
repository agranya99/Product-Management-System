# Product Management System

A scalable REST API developed in Node.Js to facilitate CRUD and utility operations on products, categories, providers (Business Partners). Authorization is performed via **OAuth 2.0 (Client Credentials Flow)** and Validation is performed using **Hapi/JOI**. The API uses MongoDB as back-end database with **Mongoose** framework for data modelling, querying and validation. **OpenAPI 3.0 Specification** is written for the API. <https://app.swaggerhub.com/apis/agranya99/Product-Management-System/1.0.0>

## Softwares and Frameworks
- OpenAPI 3.0 Specification
- express.js
- OAuth 2.0
- JOI 
- Mongoose
- MongoDB Atlas

## How to Run

### Installation

- Clone this GitHub repo to 'dir'
- Navigate to 'dir'
- Run `npm install` to install the dependencies
- Run `nodemon .\server.js` or `node .\server.js` to start a server instance of the project

### Authorization



## Features

### OpenAPI 3.0 Specification
Detailed API Description - available endpoints and possible operations on the endpoints with request and response details.

The specification is built using re-usable `schemas`, `parameters`, `requestBodies` and `responses` and includes `securitySchemes` for OAuth2.0.

Checkout <https://app.swaggerhub.com/apis/agranya99/Product-Management-System/1.0.0> or openapi-spec.yaml

### Authorization 
**OAuth 2.0 Client Credentials Grant** is implemented using Okta Authorization server. It helps with granting limited access without user credentials, set rate limits, etc.

The client (daemon) needs to fetch a valid `token` from the okta authorization server by sending a request with `clientID`, `clientSecret`, and `scope`.

The received token (whose validity can be set in the authorization server, max = 1 day) is then passed as header (`bearer`) to the API server with each request.

### Request Validation
**Hapi/JOI** is used to perform schema-based request validation. It helps enforce standards and prevent unexpected errors.

### Fetching, Searching and Pagination
`limit` and `offset` parameters can be passed as query string to set a limit on number of records to fetch at once while being able to navigate through the whole set. This helps with **scalability**. 

Like:
- `localhost:3000/products?offset=0&limit=25`,
- `localhost:3000/categories?offset=1&limit=10`,
- `localhost:3000/providers?limit=10`

**GET /products**
Fetch a list of Products via **queries**

Like:
- `localhost:3000/products?name=Blade Stealth`,
- `localhost:3000/products?provider=Razer`,
- `localhost:3000/products?qTags=marker&attributes[colors]=black`

**GET /categories**
Fetch List of Category objects using **queries**

Like:
- `localhost:3000/categories?name=Peripherals`

**GET /providers**
Fetch a list of Providers (Partner Businesses) via **queries**

Like:
- `localhost:3000/providers?name=Razer`


| Method | Endpoint                               | Description                                                                           |
|--------|----------------------------------------|---------------------------------------------------------------------------------------|
| GET    | /products/{sku}                        | Get the details of a product                                                          |
| GET    | /categories/{categoryID}               | Get the details of a category                                                         |
| GET    | /categories/{categoryID}/subCategories | Get sub categories of a category                                                      |
| GET    | /categories/{categoryID}/products      | Get all products in a category                                                        |
| GET    | /products/{sku}/similar            | Get similar products to a particular product (Based on Query Tags -  qTags attribute) |
| GET    | /providers/{providerID}                | Get the details of a Provider (Partner Business)                                      |


### Records Manipulation
MongoDB database is used for storing records. **Mongoose** is used  to model the data. It includes built-in type casting, validation, query building. Refer OpenAPI Spec for request bodies and parameters.

**Responses are consistent**

POST
- `200` with { `sku`, `status`, `message` } for successful operation
- `400` with { `status`, `message` } for Invalid Request / Duplicate Key Error

PUT
- `200` with updated `product`, `category` or `provider` object for successful operation
- `404` for Not Found Error on the resource to be updated
- `400` with { `status`, `message` } for Invalid Request

DELETE
- `200` with { `sku`, `status`, `message` } for successful operation
- `404` for Not Found Error on the resource to be updated
- `400` with { `status`, `message` } for Invalid Request

Validation Errors
- `400` response with { `status`, `message` } describing what caused the validation to fail

Internal Server Errors
- `500` response with { `status`, `message` }, no description of error


| Method | Endpoint                               | Description                                                                           |
|--------|----------------------------------------|---------------------------------------------------------------------------------------|
| POST   | /products                              | Add a new product via JSON request                                                    |
| PUT    | /products/{sku}                        | Update an existing product                                                            |
| DELETE | /products/{sku}                        | Delete an existing product                                                            |
| POST   | /categories                            | Add a new category via JSON request                                                   |
| PUT    | /categories/{categoryID}               | Update an existing category                                                           |
| DELETE | /categories/{categoryID}               | Delete an existing category and all its subcategories                                 |
| POST   | /providers                             | Add a new Provider (Partner Business) via JSON request                                                   |
| PUT    | /providers/{providerID}                | Update an existing Provider (Partner Business)                                        |
| DELETE | /providers/{providerID}                | Delete an existing Provider                                                           |

## Miscellaneous

**GET /**
Fetch a list of all valid endpoints

`GET` `POST` `PUT` `DELETE` /* 
Invalid URL handled. List of valid endpoints returned.
