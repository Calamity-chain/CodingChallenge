## HOW TO RUN THE RESOURCE EXISTENCE CONSISTENCY TEST

_The test is not supposed to comport errors > if it does it will fail_

- Source Paths are first created and the function to check existence (ExistSync) within the function CheckFile, added a console.log to make the missing file path visible.
- In the Test part we look for index.yml files and then check if the type "flyer" is correct before adding them to the activityFiles array.
- Then we sort the yml files into the different corresponding folders categories and run the CheckFiles to check their existence.
- A final check is implemented to make the whole Test Suite fail if one of the subtests fails, with Error message to aknowledge which yml Files contains failures.

## RESULTS OF THE TEST :

- No errors in Lesson 1.
- 7 Files missing In Lesson 2 :
  - reminder_note_duration.aifc
  - ddFddF_1.svg
  - short_notes.aifc
  - D_D_1.csv
  - dd.mp4
  - D_D_2.aifc
  - D_D_1.svg
