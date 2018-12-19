// import { Injectable } from '@angular/core';

// @Injectable()
// export class SeoserviceService {

//   constructor() { }

// }
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

}