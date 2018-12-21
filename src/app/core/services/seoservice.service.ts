import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable()
export class SeoserviceService {

    constructor(private title: Title, private meta: Meta) { }


    updateTitle(title: string) {
        this.title.setTitle(title);
    }

    updateDescription(desc: string) {
        this.meta.updateTag({ name: 'description', content: desc })
    }

    updateKeywords(category: string) {
        this.meta.updateTag({ name: 'keywords', content: category })
    }

    updateOg(data: any){
        this.meta.updateTag({ property: 'og:type', content: 'Website' })
        this.meta.updateTag({ property: 'og:image', content: data['og_image'] })
        this.meta.updateTag({ property: 'og:title', content: data['og_title'] })
        this.meta.updateTag({ property: 'og:description', content: data['og_description'] })
        this.meta.updateTag({ property: 'og:url', content: data['og_url'] })
    }

}