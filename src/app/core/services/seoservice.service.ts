import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class SeoserviceService {

    constructor(private title: Title, private meta: Meta, @Inject(DOCUMENT) private doc) { }


    updateTitle(title: string) {
        this.title.setTitle(title);
    }

    updateDescription(desc: string) {
        this.meta.updateTag({ name: 'description', content: desc })
    }

    updateKeywords(category: string) {
        this.meta.updateTag({ name: 'keywords', content: category })
    }

    updateOg(data: any) {
        // og
        this.meta.updateTag({ property: 'og:type', content: 'website' })
        this.meta.updateTag({ property: 'og:image', content: data['og_image'] })
        this.meta.updateTag({ property: 'og:title', content: data['og_title'] })
        this.meta.updateTag({ property: 'og:description', content: data['og_description'] })
        this.meta.updateTag({ property: 'og:url', content: data['og_url'] })
        // canonical
        this.setCanonical();
    }

    setCanonical() {
        let link: HTMLLinkElement = this.doc.createElement('link');
        link.setAttribute('rel', 'canonical');
        this.doc.head.appendChild(link);
        link.setAttribute('href', this.doc.URL);
    }

}