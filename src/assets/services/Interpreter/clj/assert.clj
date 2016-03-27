(defn assert [predicate first second asserts]
    (if (true? (predicate first second))
        (conj asserts (conj (conj [] (str first " is equal " second)) "success"))
        (conj asserts (conj (conj [] (str first " is not equal " second)) "error"))))