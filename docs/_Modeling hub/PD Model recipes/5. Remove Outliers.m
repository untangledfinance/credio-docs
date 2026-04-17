# Remove Outliers

- Transforming/removing outliers: During the EDA, we often see some feature values that are extreme and can be caused by some kind of error (for example, adding an extra digit to the age) or are simply incompatible with the rest (for example, a multimillionaire among a sample of middle-class citizens). Such outliers can skew the results of the model, and it is good practice to somehow deal with them. One solution would be to remove them at all, but this can have an impact on the model's ability to generalize. We can also bring them closer to regular values.

### How to do it...
Execute the following steps to handle outliers

1. Import the base estimator and transformer from sklearn:


```python
from sklearn.base import BaseEstimator, TransformerMixin
```

2. Define the OutlierRemover class:


```python
class OutlierRemover(BaseEstimator, TransformerMixin):
               def __init__(self, n_std=3):
                   self.n_std = n_std
               def fit(self, X, y = None):
                   if np.isnan(X).any(axis=None):
                       raise ValueError('''There are missing values in the
                                           array! Please remove them.''')
                   mean_vec = np.mean(X, axis=0)
                   std_vec = np.std(X, axis=0)
                   self.upper_band_ = mean_vec + self.n_std * std_vec
                   self.lower_band_ = mean_vec - self.n_std * std_vec
                   self.n_features_ = len(self.upper_band_)
                   return self
               def transform(self, X, y = None):
                   X_copy = pd.DataFrame(X.copy())
                   upper_band = np.repeat(
                       self.upper_band_.reshape(self.n_features_, -1),
                       len(X_copy),
                       axis=1).transpose()
                   lower_band = np.repeat(
                       self.lower_band_.reshape(self.n_features_, -1),
                       len(X_copy),
                       axis=1).transpose()
                   X_copy[X_copy >= upper_band] = upper_band
                   X_copy[X_copy <= lower_band] = lower_band
                   return X_copy.values
```
