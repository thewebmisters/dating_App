import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class SeoService {

    constructor(
        private meta: Meta,
        private title: Title
    ) { }

    updateTitle(title: string) {
        this.title.setTitle(title);
    }

    updateMetaTags(config: {
        title?: string;
        description?: string;
        image?: string;
        url?: string;
        type?: string;
        keywords?: string;
    }) {
        if (config.title) {
            this.title.setTitle(config.title);
            this.meta.updateTag({ property: 'og:title', content: config.title });
            this.meta.updateTag({ name: 'twitter:title', content: config.title });
        }

        if (config.description) {
            this.meta.updateTag({ name: 'description', content: config.description });
            this.meta.updateTag({ property: 'og:description', content: config.description });
            this.meta.updateTag({ name: 'twitter:description', content: config.description });
        }

        if (config.image) {
            this.meta.updateTag({ property: 'og:image', content: config.image });
            this.meta.updateTag({ name: 'twitter:image', content: config.image });
        }

        if (config.url) {
            this.meta.updateTag({ property: 'og:url', content: config.url });
        }

        if (config.type) {
            this.meta.updateTag({ property: 'og:type', content: config.type });
        }

        if (config.keywords) {
            this.meta.updateTag({ name: 'keywords', content: config.keywords });
        }

        // Dating app specific meta tags
        this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.meta.updateTag({ property: 'og:site_name', content: 'Dating App' });
    }

    updateStructuredData(data: any) {
        // Remove existing structured data
        const existingScript = document.querySelector('script[type="application/ld+json"]');
        if (existingScript) {
            existingScript.remove();
        }

        // Add new structured data
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(data);
        document.head.appendChild(script);
    }

    // Dating app specific SEO methods
    setLandingPageSEO() {
        this.updateMetaTags({
            title: 'Find Your Perfect Match - Dating App',
            description: 'Join thousands of singles looking for love. Create your profile and start connecting with compatible matches today.',
            keywords: 'dating, relationships, singles, love, match, romance',
            type: 'website'
        });

        this.updateStructuredData({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Dating App",
            "description": "Find your perfect match with our dating platform",
            "url": window.location.origin
        });
    }

    setSignupPageSEO() {
        this.updateMetaTags({
            title: 'Join Dating App - Create Your Profile',
            description: 'Sign up for free and start your journey to find love. Create your profile in minutes.',
            keywords: 'sign up, join, dating profile, free registration',
            type: 'website'
        });
    }

    setLoginPageSEO() {
        this.updateMetaTags({
            title: 'Login to Dating App',
            description: 'Login to your dating account and continue your search for the perfect match.',
            keywords: 'login, sign in, dating account',
            type: 'website'
        });
    }
}