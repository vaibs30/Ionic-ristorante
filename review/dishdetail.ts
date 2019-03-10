import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController , ActionSheetController, ModalController} from 'ionic-angular';
import { Dish } from '../../shared/dish';
import { Comment } from '../../shared/comment';
import { FavoriteProvider } from '../../providers/favorite/favorite';
import { CommentPage } from '../comment/comment';

/**
 * Generated class for the DishdetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-dishdetail',
  templateUrl: 'dishdetail.html',
})
export class DishdetailPage {
  dish: Dish;
  errMess: string;
  avgstars: string;
  numcomments: number;
  favorite: boolean;
  myComment: Comment;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    @Inject('BaseURL') private BaseURL,
    private favoriteservice: FavoriteProvider,
    private toastCtrl: ToastController,
    private actionCtrl: ActionSheetController,
    private modalCtrl: ModalController) {
      this.dish = navParams.get('dish');
      this.favorite = favoriteservice.isFavorite(this.dish.id);
      this.updateComments();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DishdetailPage');
  }

  addToFavorites() {
    console.log('Adding to Favorites', this.dish.id);
    this.favorite = this.favoriteservice.addFavorite(this.dish.id);
    this.toastCtrl.create({
      message: 'Dish ' + this.dish.id + ' added as a favourite successfully',
      position: 'middle',
      duration: 3000}).present();
  }

  openActions(){
    let actionSheet = this.actionCtrl.create({
      
      buttons: [{
        text: 'Add to Favorites',
        handler: () => {
          console.log('Add To Favorites clicked');
          this.addToFavorites();
        }
      }, 
      {
        text: 'Add a Comment',
        handler: () => {
          console.log('Add Comment clicked');
          let modal =  this.modalCtrl.create(CommentPage);
          modal.onDidDismiss(data => {
            console.log (data);  
            this.myComment = data;
            this.dish.comments.push(this.myComment);
            this.updateComments;
          });
        modal.present();

        }
      },  
      {
        text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('actions cancelled');
          }
      }]
    });
     actionSheet.present();
  }

  updateComments(){
    this.numcomments = this.dish.comments.length;
      let total = 0;
      this.dish.comments.forEach(comment => total += comment.rating );
      this.avgstars = (total/this.numcomments).toFixed(2);
  }

}