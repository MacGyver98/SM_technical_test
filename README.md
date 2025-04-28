# Dog Breed Explorer

Dog Breed Explorer is an Angular-based web application that allows users to explore various dog breeds, search for specific breeds, and view images of the breeds and their sub-breeds. The application leverages the [Dog CEO API](https://dog.ceo/dog-api/) to fetch breed data and images.

## Features

- **Browse All Breeds**: View a list of all available dog breeds.
- **Search Breeds**: Search for breeds by name, including sub-breeds.
- **View Images**: Display images of selected breeds and sub-breeds.
- **Lazy Loading**: Images are loaded lazily for better performance.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Technologies Used

- **Angular**: Framework for building the application.
- **Angular Material**: UI components for a modern and responsive design.
- **RxJS**: Reactive programming for handling asynchronous data streams.
- **Dog CEO API**: External API for fetching breed data and images.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Angular CLI](https://angular.io/cli) (v17 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd sm-technical-test
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:4200/
   ```

### Building the Application

To build the application for production:
```bash
npm run build
```
The build artifacts will be stored in the `dist/` directory.

### Running Unit Tests

To execute unit tests:
```bash
npm test
```

## Project Structure

The project follows a modular structure for better scalability and maintainability:

- **Core**: Shared services, guards, and interceptors.
- **Breeds**: Feature module containing components, pages, state management, and domain logic for dog breeds.
- **Shared**: Shared components, directives, and pipes.
- **Assets**: Static assets like images and styles.

## API Integration

The application integrates with the [Dog CEO API](https://dog.ceo/dog-api/) to fetch:

- List of all breeds
- Images for specific breeds and sub-breeds
- Random images for breeds

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Acknowledgments

- [Dog CEO API](https://dog.ceo/dog-api/) for providing the data.
- [Angular Material](https://material.angular.io/) for UI components.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.
