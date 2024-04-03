# Evaluate model

* The values are as follows:
  * True positive (TP): The model predicts a default, and the client defaulted.
  * False positive (FP): The model predicts a default, but the client did not default.
  * True negative (TN): The model predicts a good customer, and the client did not default.
  * False negative (FN): The model predicts a good customer, but the client defaulted.
* Using these values, we can further build multiple evaluation criteria:
  * Accuracy ((TP + TN) / (TP + FP + TN + FN))—Measures the model's overall ability to correctly predict the class of the observation.
  * Precision (TP / (TP + FP))—Out of all predictions of the positive class (in our case, the default), how many observations indeed defaulted.
  * Recall (TP /(TP + FN))—Out of all positive cases, how many were predicted correctly. Also called sensitivity or the true positive rate.
  * F-1 Score—A harmonic average of precision and recall. The reason for a harmonic mean instead of a standard mean is that it punishes extreme outcomes, such as precision = 1 and recall = 0, or vice versa.
  * Specificity (TN / (TN + FP))—Measures what fraction of negative cases (clients without a default) actually did not default.
* Understanding the subtleties behind these metrics is very important for the correct evaluation of the model's performance. Accuracy can be highly misleading in the case of class imbalance. Imagine a case when 99% of data is not fraudulent and only 1% is fraudulent. Then, a naïve model classifying each observation as non-fraudulent achieves 99% accuracy, while it is actually worthless. That is why, in such cases, we should refer to precision or recall. When we try to achieve as high precision as possible, we will get fewer false positives, at the cost of more false negatives. When optimizing for recall, we will achieve fewer false negatives, at the cost of more false positives. The metric on which we try to optimize should be selected based on the use case.
