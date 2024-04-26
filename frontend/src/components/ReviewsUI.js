import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

function ReviewsIU() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  const userData = JSON.parse(localStorage.getItem('user_data'));
  let userDisplayName = "";
  if(userData) {
    userDisplayName = userData.displayName;
  }
  let doesReviewBelongsToUser = false;

  const app_name = 'g26-big-project-6a388f7e71aa'
  function buildPath(route) {
    if (process.env.NODE_ENV === 'production') {
      return 'https://' + app_name + '.herokuapp.com/' + route;
    } else {
      return 'http://localhost:5000/' + route;
    }
  }

  const reviewBelongsToUser = (reviewDisplayName) => {
    if(reviewDisplayName === userDisplayName) {
      doesReviewBelongsToUser = true;
      // console.log(reviewDisplayName);
      // console.log(reviewDisplayName + " TRUE");
    }
    else {
      doesReviewBelongsToUser = false;
      // console.log(reviewDisplayName + " FALSE");
    }

  }


  async function fetchReviews() {
    const url = window.location.href;
    const videoGameId = url.substring(url.lastIndexOf('/') + 1);
    try {
      const response = await fetch(buildPath('api/getReviews'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ videoGameId: videoGameId })
      });
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setReviews(data.reviews);
      }
    } catch (error) {
      setError('An error occurred while fetching reviews.');
    }

    
  }

  const deleteReview = async (reviewId) => {
    console.log(reviewId);

    try {
      const response = await fetch(buildPath(`api/reviews/delete/${reviewId}`), {
        method: 'DELETE'
      });

      if(response.error) {
        console.log("Error deleting review");
        return;
      }

      if(response.message) {
        console.log(response.message);

      }


    }
    catch (e) {
      console.error(e);
    }

  }

  const deleteReviewPrompt = (reviewId) => {
    let text = "Are you sure you want to delete this review? This action cannot be undone.";

    if(window.confirm(text) == true) {
      deleteReview(reviewId)
    } else {

    }


  }

  const editReview = async () => {

  }

  useEffect(() => {
    fetchReviews();
  }, [reviews]); 

  return (
    <div className="details-reviews pt-4 px-0">
      <h1 className="">Reviews</h1>
      <hr className="opacity-50" />
      {error && <p>{error}</p>}
      {reviews.length > 0 ? (
        <div>
          {reviews.map((review, index) => (
            <div key={index} className="review-item">
              <div className="review-item" style={{ color: 'white', textAlign: 'left' }}>
                <Link className="link d-inline-flex" to={{
                  pathname: `/Profile/${review.displayName}`,
                }}>
                <img className="my-auto me-2" width="" height="" src="/user.svg" style={{ height: '20px', width: 'auto' }} />
                <p style={{ fontSize: '20px',  textAlign: 'left', margin: '0' }}><strong>{review.displayName}</strong> {Array.from({ length: review.rating }, (_, i) => <span key={i} style={{ fontSize: '24px', color: '#0A9396' }}>★</span>)}</p>
                </Link>

                {reviewBelongsToUser(review.displayName)}
                {doesReviewBelongsToUser && (
                  <>
                  <button onClick={() => deleteReviewPrompt(review._id)} className="float-end btn btn-danger text-white fw-semibold">DELETE</button>
                  {/* <button onClick={() => editReview()} className="float-end btn btn-primary text-white me-3">EDIT</button> */}
                  </>
                )}
                

                <p style={{ textAlign: 'left', fontSize: '18px', margin: '5px 0 0', color: 'lightgray'}}>{review.textBody}</p>
              </div>
              {index !== reviews.length - 1 && <hr className="opacity-50" />}
            </div>
          ))}
        </div>
      ) : (
        <p>No reviews available.</p>
      )}
    </div>
  );
}

export default ReviewsIU;


