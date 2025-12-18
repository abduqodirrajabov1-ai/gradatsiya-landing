import { useState } from 'react';
import RegistrationForm from './components/RegistrationForm';
import ImageCarousel from './components/ImageCarousel';
import Footer from './components/Footer';
import './App.css';

const CAROUSEL_IMAGES = [
    '/carousel-1.jpg',
    '/carousel-2.jpg',
    '/carousel-3.jpg',
    '/carousel-4.jpg',
    '/carousel-5.jpg',
    '/carousel-6.jpg',
    '/carousel-7.jpg',
];

function App() {
    return (
        <div className="app">
            <main className="main-content">
                <div className="content-wrapper">
                    {/* Left side - Logo and Form */}
                    <div className="left-section">
                        <div className="logo-container">
                            <img src="/logo.png" alt="Gradatsiya o'quv markazi" className="logo" />
                        </div>
                        <RegistrationForm />
                    </div>

                    {/* Right side - Image Carousel */}
                    <div className="right-section">
                        <ImageCarousel images={CAROUSEL_IMAGES} />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default App;
