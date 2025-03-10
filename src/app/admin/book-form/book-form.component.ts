import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { Book } from '../../shared/book';

@Component({
  selector: 'bm-book-form',
  templateUrl: './book-form.component.html',
  standalone: false,
  styleUrl: './book-form.component.css'
})
export class BookFormComponent implements OnChanges {
  @Input() book?: Book;
  @Output() submitBook = new EventEmitter<Book>();

  form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    subtitle: new FormControl('', { nonNullable: true }),
    isbn: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(13),
      ]
    }),
    description: new FormControl('', { nonNullable: true }),
    published: new FormControl('', { nonNullable: true }),
    authors: this.buildAuthorsArray(['']),
    thumbnailUrl: new FormControl('', { nonNullable: true })
  });

  ngOnChanges(): void {
    if (this.book) {
      this.setFormValues(this.book);
      this.setEditMode(true);
    } else {
      this.setEditMode(false);
    }
  }

  private setFormValues(book: Book) {
    this.form.patchValue(book);

    this.form.setControl(
      'authors',
      this.buildAuthorsArray(book.authors)
    );
  }

  private setEditMode(isEditing: boolean) {
    const isbnControl = this.form.controls.isbn;

    if (isEditing) {
      isbnControl.disable();
    } else {
      isbnControl.enable();
    }
  }

  private buildAuthorsArray(authors: string[]) {
    return new FormArray(
      authors.map(v => new FormControl(v, { nonNullable: true }))
    );
  }

  get authors() {
    return this.form.controls.authors;
  }

  addAuthorControl() {
    this.authors.push(new FormControl('', { nonNullable: true }));
  }

  submitForm() {
    const formValue = this.form.getRawValue();
    const authors = formValue.authors.filter(author => !!author);

    const newBook: Book = {
      ...formValue,
      authors
    };

    this.submitBook.emit(newBook);
  }
}
